'use client'

import { useI18n } from '@/lib/i18n-context'
import { MapPin, Star } from 'lucide-react'
import Image from 'next/image'

interface Hotel {
  id: string
  name: string
  location: string
  rating: string
  mainImage: string | null
  description: string
  amenities: string[] | null
  roomCount: number
}

interface DashboardHotelsProps {
  hotels: Hotel[]
}

export default function DashboardHotels({ hotels }: DashboardHotelsProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.hotels.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.hotels.subtitle')}</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          {t('dashboard.hotels.addNew')}
        </button>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
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
                <span className="text-gray-500">{hotel.roomCount} {t('dashboard.hotels.rooms')}</span>
                <div className="space-x-2">
                  <button className="text-primary hover:text-primary/80">
                    {t('dashboard.hotels.edit')}
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    {t('dashboard.hotels.delete')}
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
                        +{hotel.amenities.length - 3} {t('dashboard.hotels.more')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {hotels.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <p className="text-gray-500">{t('dashboard.hotels.noHotels')}</p>
        </div>
      )}
    </div>
  )
}
