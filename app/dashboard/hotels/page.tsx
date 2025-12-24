import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { hotels, rooms } from "@/db/schema"
import { eq, count, desc } from "drizzle-orm"
import DashboardHotels from "@/components/dashboard-hotels"

export default async function HotelsPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  // Fetch all hotels with full details
  const allHotels = await db
    .select()
    .from(hotels)
    .orderBy(desc(hotels.createdAt))

  // Get room counts for each hotel
  const hotelsWithRoomCounts = await Promise.all(
    allHotels.map(async (hotel) => {
      const [roomCount] = await db
        .select({ count: count() })
        .from(rooms)
        .where(eq(rooms.hotelId, hotel.id))

      return {
        id: hotel.id,
        name: hotel.name,
        nameAr: hotel.nameAr,
        location: hotel.location,
        locationAr: hotel.locationAr,
        description: hotel.description,
        descriptionAr: hotel.descriptionAr,
        starRating: hotel.starRating,
        rating: Number(hotel.rating),
        mainImage: hotel.mainImage,
        amenities: hotel.amenities as string[],
        availabilityStatus: hotel.availabilityStatus,
        published: hotel.published,
        featured: hotel.featured,
        createdAt: hotel.createdAt,
        roomCount: roomCount?.count || 0,
      }
    })
  )

  const stats = {
    total: allHotels.length,
    published: allHotels.filter((h) => h.published).length,
    draft: allHotels.filter((h) => !h.published).length,
    featured: allHotels.filter((h) => h.featured).length,
  }

  return <DashboardHotels stats={stats} hotels={hotelsWithRoomCounts} />
}
