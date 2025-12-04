'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'
import {
  LayoutDashboard,
  Users,
  Hotel,
  CalendarDays,
  FileText,
  Activity,
  LogOut
} from 'lucide-react'
import LocaleSwitcher from './locale-switcher'

interface DashboardSidebarProps {
  userName: string
  userRole: string
  isSuperAdmin: boolean
}

export default function DashboardSidebar({ userName, userRole, isSuperAdmin }: DashboardSidebarProps) {
  const { t } = useI18n()

  const navigation = [
    { name: t('dashboard.nav.dashboard'), href: '/dashboard', icon: LayoutDashboard, show: true },
    { name: t('dashboard.nav.bookings'), href: '/dashboard/bookings', icon: CalendarDays, show: true },
    { name: t('dashboard.nav.hotels'), href: '/dashboard/hotels', icon: Hotel, show: true },
    { name: t('dashboard.nav.blogs'), href: '/dashboard/blogs', icon: FileText, show: true },
    { name: t('dashboard.nav.users'), href: '/dashboard/users', icon: Users, show: isSuperAdmin },
    { name: t('dashboard.nav.activities'), href: '/dashboard/activities', icon: Activity, show: isSuperAdmin },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-primary">
            {t('dashboard.adminPanel')}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) =>
            item.show ? (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-primary transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ) : null
          )}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Locale Switcher */}
          <LocaleSwitcher />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('dashboard.signOut')}
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
