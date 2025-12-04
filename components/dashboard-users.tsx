'use client'

import { useI18n } from '@/lib/i18n-context'
import UserManagementClient from '@/app/dashboard/users/user-management-client'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  createdAt: Date | null
}

interface DashboardUsersProps {
  users: User[]
  currentUserId: string
}

export default function DashboardUsers({ users, currentUserId }: DashboardUsersProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.users.title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('dashboard.users.subtitle')}
        </p>
      </div>

      <UserManagementClient users={users} currentUserId={currentUserId} />
    </div>
  )
}
