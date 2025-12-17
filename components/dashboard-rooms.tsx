'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Bed, Loader2, Eye, Building, DollarSign, Users, X } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

type Room = {
  id: string
  hotelId: string
  hotelName: string
  hotelNameAr: string
  type: string
  typeAr?: string | null
  price: number
  currency: string
  available: number
  description?: string | null
  descriptionAr?: string | null
  images: string[]
  maxGuests: number
  amenities: string[]
  amenitiesAr: string[]
  size?: number | null
  bedType?: string | null
  bedTypeAr?: string | null
  addOns: any[]
  bookingConditions: any
  createdAt: Date | null
  updatedAt: Date | null
}

export default function DashboardRooms({ rooms, stats }: { rooms: Room[]; stats: { total: number; available: number; occupied: number } }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [roomList, setRoomList] = useState(rooms)
  const [loading, setLoading] = useState<string | null>(null)

  // Helper function to get localized content
  const getType = (room: Room) => locale === 'ar' && room.typeAr ? room.typeAr : room.type
  const getDescription = (room: Room) => locale === 'ar' && room.descriptionAr ? room.descriptionAr : room.description
  const getBedType = (room: Room) => locale === 'ar' && room.bedTypeAr ? room.bedTypeAr : room.bedType
  const getHotelName = (room: Room) => locale === 'ar' ? room.hotelNameAr : room.hotelName

  // Delete room
  const deleteRoom = async (roomId: string) => {
    if (!confirm(t('dashboard.rooms.confirmDelete'))) {
      return
    }

    setLoading(roomId)
    try {
      const response = await fetch(`/api/rooms?id=${roomId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('dashboard.rooms.deleteFailed'))
      }

      setRoomList(roomList.filter((room) => room.id !== roomId))
    } catch (error) {
      alert(error instanceof Error ? error.message : t('dashboard.rooms.deleteFailed'))
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {roomList.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-6">
              {/* Image */}
              <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {room.images && room.images.length > 0 ? (
                  <Image
                    src={room.images[0]}
                    alt={getType(room)}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Bed className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {getType(room)}
                    </h3>
                    <div className={`flex items-center gap-4 text-sm text-gray-500 mb-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className="flex items-center">
                        <Building className={`w-4 h-4 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {getHotelName(room)}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className={`w-4 h-4 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {room.price} {room.currency}
                      </span>
                      <span className="flex items-center">
                        <Users className={`w-4 h-4 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {room.maxGuests} {t('dashboard.rooms.guests')}
                      </span>
                      {room.bedType && (
                        <span className="flex items-center">
                          <Bed className={`w-4 h-4 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                          {getBedType(room)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        room.available > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.available} {t('dashboard.rooms.available')}
                    </span>
                  </div>
                </div>

                {getDescription(room) && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {getDescription(room)}
                  </p>
                )}

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {room.amenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{room.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div className={`flex items-center gap-3 text-sm ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Link
                    href={`/dashboard/rooms/edit/${room.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {t('dashboard.rooms.edit')}
                  </Link>
                  <button
                    onClick={() => deleteRoom(room.id)}
                    disabled={loading === room.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === room.id && (
                      <Loader2 className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'} animate-spin`} />
                    )}
                    {t('dashboard.rooms.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {roomList.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {t('dashboard.rooms.noRooms')}
          </p>
        </div>
      )}
    </>
  )
}

