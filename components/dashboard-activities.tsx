'use client'

import { useI18n } from '@/lib/i18n-context'
import { Activity, Clock, Globe } from 'lucide-react'

interface ActivityLog {
  id: string
  userId: string | null
  action: string
  details: any
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date | null
  userName: string | null
  userEmail: string | null
}

interface DashboardActivitiesProps {
  activities: ActivityLog[]
}

export default function DashboardActivities({ activities }: DashboardActivitiesProps) {
  const { t } = useI18n()

  const getActionColor = (action: string) => {
    if (action.includes('login')) return 'text-green-600 bg-green-100'
    if (action.includes('logout')) return 'text-gray-600 bg-gray-100'
    if (action.includes('create') || action.includes('book')) return 'text-blue-600 bg-blue-100'
    if (action.includes('update')) return 'text-yellow-600 bg-yellow-100'
    if (action.includes('delete')) return 'text-red-600 bg-red-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return '🔓'
    if (action.includes('logout')) return '🔒'
    if (action.includes('create') || action.includes('book')) return '➕'
    if (action.includes('update')) return '✏️'
    if (action.includes('delete')) return '🗑️'
    return '📝'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.activities.title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('dashboard.activities.subtitle')}
        </p>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50">
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(activity.action)}`}>
                  <span className="text-lg">{getActionIcon(activity.action)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.userName || t('dashboard.activities.unknownUser')}
                        <span className="text-gray-500 font-normal ml-2">
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.userEmail}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {activity.createdAt
                        ? new Date(activity.createdAt).toLocaleString()
                        : 'N/A'}
                    </div>
                  </div>

                  {/* Details */}
                  {activity.details && (
                    <div className="bg-gray-50 rounded p-3 mt-2 text-sm text-gray-700">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(activity.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    {activity.ipAddress && (
                      <span className="flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        {t('dashboard.activities.ip')}: {activity.ipAddress}
                      </span>
                    )}
                    {activity.userAgent && (
                      <span className="flex items-center truncate max-w-md">
                        <Activity className="w-3 h-3 mr-1" />
                        {activity.userAgent}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activities.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">{t('dashboard.activities.noActivities')}</p>
        </div>
      )}

      {activities.length === 100 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          {t('dashboard.activities.showingLatest')}
        </div>
      )}
    </div>
  )
}
