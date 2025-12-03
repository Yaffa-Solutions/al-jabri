"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Loader2, Eye } from "lucide-react"

type Blog = {
  id: string
  title: string
  excerpt: string
  coverImage: string | null
  category: string
  readTime: string | null
  published: boolean
  createdAt: Date | null
  authorName: string | null
  authorEmail: string | null
}

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const router = useRouter()
  const [blogList, setBlogList] = useState(blogs)
  const [loading, setLoading] = useState<string | null>(null)

  const deleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setLoading(blogId)
    try {
      const response = await fetch(`/api/blogs?id=${blogId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete blog")
      }

      setBlogList(blogList.filter((blog) => blog.id !== blogId))
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete blog")
    } finally {
      setLoading(null)
    }
  }

  const togglePublish = async (blogId: string, currentStatus: boolean) => {
    const action = currentStatus ? "unpublish" : "publish"
    if (!confirm(`Are you sure you want to ${action} this blog post?`)) {
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
        throw new Error(error.error || `Failed to ${action} blog`)
      }

      setBlogList(
        blogList.map((blog) =>
          blog.id === blogId ? { ...blog, published: !currentStatus } : blog
        )
      )
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : `Failed to ${action} blog`)
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
                    alt={blog.title}
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
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {blog.authorName || "Unknown"}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString()
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
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="flex items-center gap-3 text-sm">
                  <Link
                    href={`/dashboard/blogs/edit/${blog.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/blogs/${blog.id}`}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Link>
                  <button
                    onClick={() => togglePublish(blog.id, blog.published)}
                    disabled={loading === blog.id}
                    className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === blog.id && (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    )}
                    {blog.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    disabled={loading === blog.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center"
                  >
                    {loading === blog.id && (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    )}
                    Delete
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
            No blog posts found. Create your first post to get started.
          </p>
        </div>
      )}
    </>
  )
}
