'use client'

import { useI18n } from '@/lib/i18n-context'
import Link from 'next/link'
import DashboardRooms from '@/components/dashboard-rooms'

interface RoomStats {
  total: number
  available: number
  occupied: number
}

interface Room {
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

interface DashboardRoomsWrapperProps {
  stats: RoomStats
  rooms: Room[]
}

export default function DashboardRoomsWrapper({ stats, rooms }: DashboardRoomsWrapperProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.rooms.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.rooms.subtitle')}</p>
        </div>
        <Link 
          href="/dashboard/rooms/new" 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('dashboard.rooms.addNew')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.rooms.totalRooms')}</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.rooms.availableRooms')}</p>
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.rooms.occupiedRooms')}</p>
          <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
        </div>
      </div>

      {/* Rooms List */}
      <DashboardRooms rooms={rooms} stats={stats} />
    </div>
  )
}

