'use client'

import { useI18n } from '@/lib/i18n-context'
import Link from 'next/link'
import BlogListClient from '@/app/dashboard/blogs/blog-list-client'

interface BlogStats {
  total: number
  published: number
  draft: number
}

interface DashboardBlogsProps {
  stats: BlogStats
  blogs: any[]
}

export default function DashboardBlogs({ stats, blogs }: DashboardBlogsProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.blogs.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.blogs.subtitle')}</p>
        </div>
        <Link href="/dashboard/blogs/new" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          {t('dashboard.blogs.createNew')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.blogs.totalPosts')}</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.blogs.published')}</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t('dashboard.blogs.drafts')}</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
      </div>

      {/* Blogs List */}
      <BlogListClient blogs={blogs} />
    </div>
  )
}
