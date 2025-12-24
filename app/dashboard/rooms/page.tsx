import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { rooms, hotels } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import DashboardRoomsWrapper from "@/components/dashboard-rooms-wrapper"

export default async function RoomsPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  // Fetch all rooms with hotel info
  const allRooms = await db
    .select()
    .from(rooms)
    .orderBy(desc(rooms.createdAt))

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
        addOns: room.addOns || [],
        bookingConditions: room.bookingConditions || {},
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      }
    })
  )

  const stats = {
    total: allRooms.length,
    available: allRooms.filter((r) => r.available > 0).length,
    occupied: allRooms.filter((r) => r.available === 0).length,
  }

  return <DashboardRoomsWrapper stats={stats} rooms={roomsWithHotel} />
}

