import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { hotels, rooms } from "@/db/schema"
import { eq, count } from "drizzle-orm"
import DashboardHotels from "@/components/dashboard-hotels"

export default async function HotelsPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  // Fetch all hotels with room count
  const allHotels = await db
    .select({
      id: hotels.id,
      name: hotels.name,
      location: hotels.location,
      rating: hotels.rating,
      mainImage: hotels.mainImage,
      description: hotels.description,
      amenities: hotels.amenities,
      createdAt: hotels.createdAt,
    })
    .from(hotels)

  // Get room counts for each hotel
  const hotelsWithRoomCounts = await Promise.all(
    allHotels.map(async (hotel) => {
      const [roomCount] = await db
        .select({ count: count() })
        .from(rooms)
        .where(eq(rooms.hotelId, hotel.id))

      return {
        ...hotel,
        roomCount: roomCount?.count || 0,
      }
    })
  )

  return <DashboardHotels hotels={hotelsWithRoomCounts} />
}
