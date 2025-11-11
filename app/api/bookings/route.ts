import { NextResponse } from "next/server"

// In-memory storage for bookings (in production, use a database)
const bookings: any[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (id) {
    const booking = bookings.find((b) => b.id === id)
    if (booking) {
      return NextResponse.json({ success: true, data: booking })
    }
    return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: bookings })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "hotelId",
      "hotelName",
      "checkIn",
      "checkOut",
      "guests",
      "roomType",
      "fullName",
      "email",
      "phone",
    ]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Create new booking
    const newBooking = {
      id: `BK${Date.now()}`,
      ...body,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
      confirmationNumber: `CNF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    }

    bookings.push(newBooking)

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: "Booking created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  }
}
