'use client'

import { useI18n } from '@/lib/i18n-context'
import { Hotel, Users, CalendarDays, FileText } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalBookings: number
  totalHotels: number
  totalBlogs: number
}

interface DashboardHomeProps {
  stats: DashboardStats
  userName: string
}

export default function DashboardHome({ stats, userName }: DashboardHomeProps) {
  const { t } = useI18n()

  const statsConfig = [
    {
      name: t('dashboard.stats.totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: t('dashboard.stats.totalBookings'),
      value: stats.totalBookings,
      icon: CalendarDays,
      color: 'bg-green-500',
    },
    {
      name: t('dashboard.stats.totalHotels'),
      value: stats.totalHotels,
      icon: Hotel,
      color: 'bg-purple-500',
    },
    {
      name: t('dashboard.stats.totalBlogs'),
      value: stats.totalBlogs,
      icon: FileText,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('dashboard.welcome')}, {userName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/bookings"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <CalendarDays className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold">{t('dashboard.manageBookings')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('dashboard.manageBookingsDesc')}
            </p>
          </a>
          <a
            href="/dashboard/hotels"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <Hotel className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold">{t('dashboard.manageHotels')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('dashboard.manageHotelsDesc')}
            </p>
          </a>
          <a
            href="/dashboard/blogs"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold">{t('dashboard.manageBlogs')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('dashboard.manageBlogsDesc')}
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
