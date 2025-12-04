"use client"

import { useState } from "react"
import { Trash2, Shield } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

type User = {
  id: string
  name: string | null
  email: string
  role: "user" | "admin" | "super-admin"
  image: string | null
  createdAt: Date | null
}

export default function UserManagementClient({
  users,
  currentUserId,
}: {
  users: User[]
  currentUserId: string
}) {
  const { t, locale } = useI18n()
  const [userList, setUserList] = useState(users)
  const [loading, setLoading] = useState<string | null>(null)
  const isRtl = locale === 'ar'

  const getRoleTranslation = (role: string) => {
    switch (role) {
      case 'super-admin':
        return t('dashboard.users.roleSuperAdmin')
      case 'admin':
        return t('dashboard.users.roleAdmin')
      default:
        return t('dashboard.users.roleUser')
    }
  }

  const updateUserRole = async (userId: string, newRole: "user" | "admin" | "super-admin") => {
    if (!confirm(`${t('dashboard.users.confirmRoleChange')} ${getRoleTranslation(newRole)}?`)) {
      return
    }

    setLoading(userId)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('dashboard.users.updateFailed'))
      }

      // Update local state
      setUserList(
        userList.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      )
    } catch (error) {
      alert(error instanceof Error ? error.message : t('dashboard.users.updateFailed'))
    } finally {
      setLoading(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm(t('dashboard.users.confirmDelete'))) {
      return
    }

    setLoading(userId)
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('dashboard.users.deleteFailed'))
      }

      // Remove from local state
      setUserList(userList.filter((user) => user.id !== userId))
    } catch (error) {
      alert(error instanceof Error ? error.message : t('dashboard.users.deleteFailed'))
    } finally {
      setLoading(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super-admin":
        return "bg-red-100 text-red-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <thead className="bg-gray-50">
            <tr>
              <th className={`px-6 py-3 ${locale === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {t('dashboard.users.user')}
              </th>
              <th className={`px-6 py-3 ${locale === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {t('dashboard.users.email')}
              </th>
              <th className={`px-6 py-3 ${locale === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {t('dashboard.users.role')}
              </th>
              <th className={`px-6 py-3 ${locale === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {t('dashboard.users.joined')}
              </th>
              <th className={`px-6 py-3 ${locale === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {t('dashboard.users.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userList.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </div>
                    <div className={locale === 'ar' ? 'mr-4' : 'ml-4'}>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || t('dashboard.users.noName')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleTranslation(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
                    : "N/A"}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${locale === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  {user.id !== currentUserId && (
                    <>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateUserRole(
                            user.id,
                            e.target.value as "user" | "admin" | "super-admin"
                          )
                        }
                        disabled={loading === user.id}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="user">{t('dashboard.users.roleUser')}</option>
                        <option value="admin">{t('dashboard.users.roleAdmin')}</option>
                        <option value="super-admin">{t('dashboard.users.roleSuperAdmin')}</option>
                      </select>
                      <button
                        onClick={() => deleteUser(user.id)}
                        disabled={loading === user.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title={t('dashboard.users.deleteUser')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {user.id === currentUserId && (
                    <span className="text-xs text-gray-400">{t('dashboard.users.you')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
