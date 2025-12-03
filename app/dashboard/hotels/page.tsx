import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { hotels, rooms } from "@/db/schema"
import { eq, count } from "drizzle-orm"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"

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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotels Management</h1>
          <p className="text-gray-600 mt-2">Manage hotel listings and information</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Add New Hotel
        </button>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelsWithRoomCounts.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-200">
              {hotel.mainImage && (
                <Image
                  src={hotel.mainImage}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {hotel.name}
                </h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {hotel.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{hotel.location}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {hotel.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{hotel.roomCount} rooms</span>
                <div className="space-x-2">
                  <button className="text-primary hover:text-primary/80">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </div>
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {hotelsWithRoomCounts.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hotels found. Add your first hotel to get started.</p>
        </div>
      )}
    </div>
  )
}
