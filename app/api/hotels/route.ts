import { NextResponse } from "next/server"
import { db } from "@/db"
import { hotels, rooms } from "@/db/schema"
import { eq, ilike, or } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const location = searchParams.get("location")

    // Get specific hotel by ID with its rooms
    if (id) {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1)

      if (!hotel) {
        return NextResponse.json({ success: false, error: "Hotel not found" }, { status: 404 })
      }

      // Get rooms for this hotel
      const hotelRooms = await db.select().from(rooms).where(eq(rooms.hotelId, id))

      // Format response to match frontend expectations
      const formattedHotel = {
        id: hotel.id,
        name: hotel.name,
        nameAr: hotel.nameAr,
        location: hotel.location,
        locationAr: hotel.locationAr,
        price: hotelRooms.length > 0 ? Number(hotelRooms[0].price) : 0, // Lowest room price
        rating: Number(hotel.rating),
        reviews: hotel.reviews,
        image: hotel.mainImage,
        amenities: hotel.amenities as string[],
        amenitiesAr: hotel.amenitiesAr as string[],
        description: hotel.description,
        descriptionAr: hotel.descriptionAr,
        rooms: hotelRooms.map((room) => ({
          type: room.type,
          price: Number(room.price),
          available: room.available,
        })),
      }

      return NextResponse.json({ success: true, data: formattedHotel })
    }

    // Get all hotels or filter by location
    let query = db.select().from(hotels)

    if (location) {
      query = db
        .select()
        .from(hotels)
        .where(or(ilike(hotels.location, `%${location}%`), ilike(hotels.locationAr, `%${location}%`)))
    }

    const allHotels = await query

    // Get rooms for each hotel to determine starting price
    const hotelsWithData = await Promise.all(
      allHotels.map(async (hotel) => {
        const hotelRooms = await db.select().from(rooms).where(eq(rooms.hotelId, hotel.id))

        // Find lowest room price
        const lowestPrice = hotelRooms.length > 0 ? Math.min(...hotelRooms.map((r) => Number(r.price))) : 0

        return {
          id: hotel.id,
          name: hotel.name,
          nameAr: hotel.nameAr,
          location: hotel.location,
          locationAr: hotel.locationAr,
          price: lowestPrice,
          rating: Number(hotel.rating),
          reviews: hotel.reviews,
          image: hotel.mainImage,
          amenities: hotel.amenities as string[],
          amenitiesAr: hotel.amenitiesAr as string[],
          description: hotel.description,
          descriptionAr: hotel.descriptionAr,
          rooms: hotelRooms.map((room) => ({
            type: room.type,
            price: Number(room.price),
            available: room.available,
          })),
        }
      }),
    )

    return NextResponse.json({ success: true, data: hotelsWithData })
  } catch (error) {
    console.error("[v0] Error fetching hotels:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch hotels" }, { status: 500 })
  }
}
