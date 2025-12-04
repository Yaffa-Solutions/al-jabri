"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Loader2, Eye } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

type Blog = {
  id: string
  title: string
  titleAr: string | null
  excerpt: string
  excerptAr: string | null
  coverImage: string | null
  category: string
  readTime: string | null
  published: boolean
  createdAt: Date | null
  authorName: string | null
  authorEmail: string | null
}

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [blogList, setBlogList] = useState(blogs)
  const [loading, setLoading] = useState<string | null>(null)

  // Helper function to get the appropriate title based on locale
  const getTitle = (blog: Blog) => {
    if (locale === 'ar' && blog.titleAr) {
      return blog.titleAr
    }
    return blog.title
  }

  // Helper function to get the appropriate excerpt based on locale
  const getExcerpt = (blog: Blog) => {
    if (locale === 'ar' && blog.excerptAr) {
      return blog.excerptAr
    }
    return blog.excerpt
  }

  const deleteBlog = async (blogId: string) => {
    if (!confirm(t('dashboard.blogs.confirmDelete'))) {
      return
    }

    setLoading(blogId)
    try {
      const response = await fetch(`/api/blogs?id=${blogId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('dashboard.blogs.deleteFailed'))
      }

      setBlogList(blogList.filter((blog) => blog.id !== blogId))
    } catch (error) {
      alert(error instanceof Error ? error.message : t('dashboard.blogs.deleteFailed'))
    } finally {
      setLoading(null)
    }
  }

  const togglePublish = async (blogId: string, currentStatus: boolean) => {
    const confirmMessage = currentStatus ? t('dashboard.blogs.confirmUnpublish') : t('dashboard.blogs.confirmPublish')
    const errorKey = currentStatus ? 'dashboard.blogs.unpublishFailed' : 'dashboard.blogs.publishFailed'

    if (!confirm(confirmMessage)) {
      return
    }

    setLoading(blogId)
    try {
      const response = await fetch("/api/blogs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blogId, published: !currentStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t(errorKey))
      }

      setBlogList(
        blogList.map((blog) =>
          blog.id === blogId ? { ...blog, published: !currentStatus } : blog
        )
      )
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : t(errorKey))
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {blogList.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-6">
              {/* Image */}
              {blog.coverImage && (
                <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={blog.coverImage}
                    alt={getTitle(blog)}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {getTitle(blog)}
                    </h3>
                    <div className={`flex items-center gap-4 text-sm text-gray-500 mb-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className="flex items-center">
                        <User className={`w-4 h-4 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {blog.authorName || t('dashboard.blogs.unknown')}
                      </span>
                      <span className="flex items-center">
                        <Calendar className={`w-4 h-4 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
                          : "N/A"}
                      </span>
                      {blog.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {blog.category}
                        </span>
                      )}
                      {blog.readTime && (
                        <span className="text-gray-500">{blog.readTime}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        blog.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.published ? t('dashboard.blogs.published') : t('dashboard.blogs.draft')}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {getExcerpt(blog)}
                </p>

                <div className={`flex items-center gap-3 text-sm ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Link
                    href={`/dashboard/blogs/edit/${blog.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {t('dashboard.blogs.edit')}
                  </Link>
                  <Link
                    href={`/blogs/${blog.id}`}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <Eye className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'}`} />
                    {t('dashboard.blogs.preview')}
                  </Link>
                  <button
                    onClick={() => togglePublish(blog.id, blog.published)}
                    disabled={loading === blog.id}
                    className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === blog.id && (
                      <Loader2 className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'} animate-spin`} />
                    )}
                    {blog.published ? t('dashboard.blogs.unpublish') : t('dashboard.blogs.publish')}
                  </button>
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    disabled={loading === blog.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === blog.id && (
                      <Loader2 className={`w-3 h-3 ${locale === 'ar' ? 'ml-1' : 'mr-1'} animate-spin`} />
                    )}
                    {t('dashboard.blogs.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogList.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {t('dashboard.blogs.noPosts')}
          </p>
        </div>
      )}
    </>
  )
}
