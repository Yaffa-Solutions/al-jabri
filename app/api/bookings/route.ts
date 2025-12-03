import { NextResponse } from "next/server"
import { db } from "@/db"
import { bookings, rooms } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { logActivity, ActivityActions } from "@/lib/activity-logger"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // If no session, return error
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get specific booking by ID
    if (id) {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1)

      if (!booking) {
        return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
      }

      // Only allow users to see their own bookings (unless admin/super-admin)
      if (
        booking.userId !== session.user.id &&
        session.user.role !== "admin" &&
        session.user.role !== "super-admin"
      ) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
      }

      return NextResponse.json({ success: true, data: booking })
    }

    // Get all bookings for the user (or all if admin)
    let userBookings
    if (session.user.role === "admin" || session.user.role === "super-admin") {
      userBookings = await db.select().from(bookings)
    } else {
      userBookings = await db.select().from(bookings).where(eq(bookings.userId, session.user.id))
    }

    return NextResponse.json({ success: true, data: userBookings })
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["hotelId", "roomId", "checkIn", "checkOut", "guests", "fullName", "email", "phone"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    // Get room details to calculate price
    const [room] = await db.select().from(rooms).where(eq(rooms.id, body.roomId)).limit(1)

    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 })
    }

    // Check if room is available
    if (room.available <= 0) {
      return NextResponse.json({ success: false, error: "Room is not available" }, { status: 400 })
    }

    // Calculate total price (simple calculation: room price * number of nights)
    const checkIn = new Date(body.checkIn)
    const checkOut = new Date(body.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = Number(room.price) * nights

    // Generate confirmation number
    const confirmationNumber = `CNF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Create new booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId: session.user.id,
        hotelId: body.hotelId,
        roomId: body.roomId,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
        guests: body.guests,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        totalPrice: totalPrice.toString(),
        discountApplied: "0.00",
        status: "confirmed",
        confirmationNumber,
      })
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: ActivityActions.BOOKING_CREATED,
      details: {
        bookingId: newBooking.id,
        hotelId: body.hotelId,
        confirmationNumber,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  }
}
