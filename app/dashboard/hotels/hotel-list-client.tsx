"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Loader2, Eye, Building, Check, X } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import type { AvailabilityStatus } from "@/types/hotel"
import { availabilityLabels } from "@/types/hotel"

type Hotel = {
  id: string
  name: string
  nameAr: string
  location: string
  locationAr: string
  description: string
  descriptionAr: string
  starRating: number
  rating: number
  mainImage: string | null
  amenities: string[]
  availabilityStatus: AvailabilityStatus
  published: boolean
  featured: boolean
  createdAt: Date | null
  roomCount: number
}

export default function HotelListClient({ hotels }: { hotels: Hotel[] }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [hotelList, setHotelList] = useState(hotels)
  const [loading, setLoading] = useState<string | null>(null)

  // Helper function to get localized content
  const getName = (hotel: Hotel) => locale === 'ar' ? hotel.nameAr : hotel.name
  const getLocation = (hotel: Hotel) => locale === 'ar' ? hotel.locationAr : hotel.location
  const getDescription = (hotel: Hotel) => locale === 'ar' ? hotel.descriptionAr : hotel.description

  // Delete hotel
  const deleteHotel = async (hotelId: string) => {
    if (!confirm(t('dashboard.hotels.confirmDelete'))) {
      return
    }

    setLoading(hotelId)
    try {
      const response = await fetch(`/api/hotels?id=${hotelId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('dashboard.hotels.deleteFailed'))
      }

      setHotelList(hotelList.filter((hotel) => hotel.id !== hotelId))
    } catch (error) {
      alert(error instanceof Error ? error.message : t('dashboard.hotels.deleteFailed'))
    } finally {
      setLoading(null)
    }
  }

  // Toggle publish status
  const togglePublish = async (hotelId: string, currentStatus: boolean) => {
    const confirmMessage = currentStatus 
      ? t('dashboard.hotels.confirmUnpublish') 
      : t('dashboard.hotels.confirmPublish')

    if (!confirm(confirmMessage)) {
      return
    }

    setLoading(hotelId)
    try {
      const response = await fetch("/api/hotels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hotelId, published: !currentStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('dashboard.hotels.updateFailed'))
      }

      setHotelList(
        hotelList.map((hotel) =>
          hotel.id === hotelId ? { ...hotel, published: !currentStatus } : hotel
        )
      )
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : t('dashboard.hotels.updateFailed'))
    } finally {
      setLoading(null)
    }
  }

  // Toggle featured status
  const toggleFeatured = async (hotelId: string, currentStatus: boolean) => {
    setLoading(hotelId)
    try {
      const response = await fetch("/api/hotels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hotelId, featured: !currentStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('dashboard.hotels.updateFailed'))
      }

      setHotelList(
        hotelList.map((hotel) =>
          hotel.id === hotelId ? { ...hotel, featured: !currentStatus } : hotel
        )
      )
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : t('dashboard.hotels.updateFailed'))
    } finally {
      setLoading(null)
    }
  }

  // Get availability color
  const getAvailabilityColor = (status: AvailabilityStatus) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      limited: 'bg-yellow-100 text-yellow-800',
      fully_booked: 'bg-red-100 text-red-800',
      closed: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || colors.available
  }

  return (
    <>
      <div className="space-y-4">
        {hotelList.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-6">
              {/* Image */}
              <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {hotel.mainImage ? (
                  <Image
                    src={hotel.mainImage}
                    alt={getName(hotel)}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {getName(hotel)}
                    </h3>
                    <div className={`flex items-center gap-4 text-sm text-gray-500 mb-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className="flex items-center">
                        <MapPin className={`w-4 h-4 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {getLocation(hotel)}
                      </span>
                      <span className="flex items-center text-yellow-500">
                        {[...Array(hotel.starRating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </span>
                      {hotel.rating > 0 && (
                        <span className="text-gray-600">
                          {hotel.rating.toFixed(1)} ({hotel.roomCount} {t('dashboard.hotels.rooms')})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hotel.featured && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {t('dashboard.hotels.featured')}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        hotel.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {hotel.published ? t('dashboard.hotels.published') : t('dashboard.hotels.draft')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(hotel.availabilityStatus)}`}>
                      {locale === 'ar' 
                        ? availabilityLabels[hotel.availabilityStatus].ar 
                        : availabilityLabels[hotel.availabilityStatus].en}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {getDescription(hotel)}
                </p>

                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{hotel.amenities.length - 4} {t('dashboard.hotels.more')}
                      </span>
                    )}
                  </div>
                )}

                <div className={`flex items-center gap-3 text-sm ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Link
                    href={`/dashboard/hotels/edit/${hotel.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {t('dashboard.hotels.edit')}
                  </Link>
                  <Link
                    href={`/booking/results?id=${hotel.id}`}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <Eye className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                    {t('dashboard.hotels.preview')}
                  </Link>
                  <button
                    onClick={() => togglePublish(hotel.id, hotel.published)}
                    disabled={loading === hotel.id}
                    className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === hotel.id && (
                      <Loader2 className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'} animate-spin`} />
                    )}
                    {hotel.published ? t('dashboard.hotels.unpublish') : t('dashboard.hotels.publish')}
                  </button>
                  <button
                    onClick={() => toggleFeatured(hotel.id, hotel.featured)}
                    disabled={loading === hotel.id}
                    className="text-purple-600 hover:text-purple-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === hotel.id && (
                      <Loader2 className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'} animate-spin`} />
                    )}
                    {hotel.featured ? t('dashboard.hotels.unfeature') : t('dashboard.hotels.feature')}
                  </button>
                  <button
                    onClick={() => deleteHotel(hotel.id)}
                    disabled={loading === hotel.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === hotel.id && (
                      <Loader2 className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'} animate-spin`} />
                    )}
                    {t('dashboard.hotels.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hotelList.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {t('dashboard.hotels.noHotels')}
          </p>
        </div>
      )}
    </>
  )
}

