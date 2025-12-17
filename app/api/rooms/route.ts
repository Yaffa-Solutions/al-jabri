import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { rooms, hotels } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { logActivity } from "@/lib/activity-logger"

// GET - Fetch rooms (with optional hotelId filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const hotelId = searchParams.get("hotelId")

    // Get specific room by ID
    if (id) {
      const [room] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1)

      if (!room) {
        return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 })
      }

      // Get hotel info
      const [hotel] = await db.select().from(hotels).where(eq(hotels.id, room.hotelId)).limit(1)

      const formattedRoom = {
        id: room.id,
        hotelId: room.hotelId,
        hotelName: hotel?.name || '',
        hotelNameAr: hotel?.nameAr || '',
        type: room.type,
        typeAr: room.typeAr,
        price: Number(room.price),
        currency: room.currency,
        available: room.available,
        description: room.description,
        descriptionAr: room.descriptionAr,
        images: room.images as string[],
        maxGuests: room.maxGuests,
        amenities: room.amenities as string[],
        amenitiesAr: room.amenitiesAr as string[],
        size: room.size,
        bedType: room.bedType,
        bedTypeAr: room.bedTypeAr,
        addOns: (room.addOns || []) as any[],
        bookingConditions: (room.bookingConditions || {}) as any,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      }

      return NextResponse.json({ success: true, data: formattedRoom })
    }

    // Fetch rooms with optional hotelId filter
    let allRooms
    
    if (hotelId) {
      allRooms = await db
        .select()
        .from(rooms)
        .where(eq(rooms.hotelId, hotelId))
        .orderBy(desc(rooms.createdAt))
    } else {
      allRooms = await db.select().from(rooms).orderBy(desc(rooms.createdAt))
    }

    // Get hotel info for each room
    const roomsWithHotel = await Promise.all(
      allRooms.map(async (room) => {
        const [hotel] = await db.select().from(hotels).where(eq(hotels.id, room.hotelId)).limit(1)

        return {
          id: room.id,
          hotelId: room.hotelId,
          hotelName: hotel?.name || '',
          hotelNameAr: hotel?.nameAr || '',
          type: room.type,
          typeAr: room.typeAr,
          price: Number(room.price),
          currency: room.currency,
          available: room.available,
          description: room.description,
          descriptionAr: room.descriptionAr,
          images: room.images as string[],
          maxGuests: room.maxGuests,
          amenities: room.amenities as string[],
          amenitiesAr: room.amenitiesAr as string[],
          size: room.size,
          bedType: room.bedType,
          bedTypeAr: room.bedTypeAr,
        addOns: (room.addOns || []) as any[],
        bookingConditions: (room.bookingConditions || {}) as any,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        }
      })
    )

    return NextResponse.json({ success: true, data: roomsWithHotel })
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch rooms" }, { status: 500 })
  }
}

// POST - Create new room
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      hotelId,
      type,
      typeAr,
      price,
      currency,
      available,
      description,
      descriptionAr,
      images,
      maxGuests,
      amenities,
      amenitiesAr,
      size,
      bedType,
      bedTypeAr,
      addOns,
      bookingConditions,
    } = body

    // Validate required fields
    if (!hotelId || !type || !price) {
      return NextResponse.json({ error: "Missing required fields: hotelId, type, and price are required" }, { status: 400 })
    }

    // Check if hotel exists
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, hotelId)).limit(1)
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    const [newRoom] = await db
      .insert(rooms)
      .values({
        hotelId,
        type,
        typeAr: typeAr || null,
        price: price.toString(),
        currency: currency || "SAR",
        available: available || 0,
        description: description || null,
        descriptionAr: descriptionAr || null,
        images: images || [],
        maxGuests: maxGuests || 2,
        amenities: amenities || [],
        amenitiesAr: amenitiesAr || [],
        size: size || null,
        bedType: bedType || null,
        bedTypeAr: bedTypeAr || null,
        addOns: addOns || [],
        bookingConditions: bookingConditions || {},
      })
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "room_created",
      details: { roomId: newRoom.id, hotelId, type },
      request,
    })

    return NextResponse.json({ success: true, data: newRoom })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}

// PUT - Update room
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      hotelId,
      type,
      typeAr,
      price,
      currency,
      available,
      description,
      descriptionAr,
      images,
      maxGuests,
      amenities,
      amenitiesAr,
      size,
      bedType,
      bedTypeAr,
      addOns,
      bookingConditions,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
    }

    // Validate required fields
    if (!type || !price) {
      return NextResponse.json({ error: "Missing required fields: type and price are required" }, { status: 400 })
    }

    // Check if room exists
    const [existingRoom] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1)

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // If hotelId is being changed, verify new hotel exists
    if (hotelId && hotelId !== existingRoom.hotelId) {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.id, hotelId)).limit(1)
      if (!hotel) {
        return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
      }
    }

    const updateData: any = {
      type,
      typeAr: typeAr || null,
      price: price.toString(),
      currency: currency || existingRoom.currency,
      available: available !== undefined ? available : existingRoom.available,
      description: description !== undefined ? description : existingRoom.description,
      descriptionAr: descriptionAr !== undefined ? descriptionAr : existingRoom.descriptionAr,
      images: images !== undefined ? images : existingRoom.images,
      maxGuests: maxGuests !== undefined ? maxGuests : existingRoom.maxGuests,
      amenities: amenities !== undefined ? amenities : existingRoom.amenities,
      amenitiesAr: amenitiesAr !== undefined ? amenitiesAr : existingRoom.amenitiesAr,
      size: size !== undefined ? size : existingRoom.size,
      bedType: bedType !== undefined ? bedType : existingRoom.bedType,
      bedTypeAr: bedTypeAr !== undefined ? bedTypeAr : existingRoom.bedTypeAr,
      addOns: addOns !== undefined ? addOns : existingRoom.addOns,
      bookingConditions: bookingConditions !== undefined ? bookingConditions : existingRoom.bookingConditions,
      updatedAt: new Date(),
    }

    if (hotelId) {
      updateData.hotelId = hotelId
    }

    const [updatedRoom] = await db
      .update(rooms)
      .set(updateData)
      .where(eq(rooms.id, id))
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "room_updated",
      details: { roomId: id, hotelId: updatedRoom.hotelId, type },
      request,
    })

    return NextResponse.json({ success: true, data: updatedRoom })
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

// DELETE - Delete room
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
    }

    // Check if room exists
    const [existingRoom] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1)

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Delete room
    await db.delete(rooms).where(eq(rooms.id, id))

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "room_deleted",
      details: { roomId: id, hotelId: existingRoom.hotelId, type: existingRoom.type },
      request,
    })

    return NextResponse.json({ success: true, message: "Room deleted successfully" })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}

