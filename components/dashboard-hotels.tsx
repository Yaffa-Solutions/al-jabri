'use client'

import { useI18n } from '@/lib/i18n-context'
import Link from 'next/link'
import HotelListClient from '@/app/dashboard/hotels/hotel-list-client'
import type { AvailabilityStatus } from '@/types/hotel'

interface HotelStats {
  total: number
  published: number
  draft: number
  featured: number
}

interface Hotel {
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

interface DashboardHotelsProps {
  stats: HotelStats
  hotels: Hotel[]
}

export default function DashboardHotels({ stats, hotels }: DashboardHotelsProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.hotels.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.hotels.subtitle')}</p>
        </div>
        <Link 
          href="/dashboard/hotels/new" 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('dashboard.hotels.addNew')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.hotels.totalHotels')}</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.hotels.publishedHotels')}</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.hotels.draftHotels')}</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.hotels.featuredHotels')}</p>
          <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
        </div>
      </div>

      {/* Hotels List */}
      <HotelListClient hotels={hotels} />
    </div>
  )
}
