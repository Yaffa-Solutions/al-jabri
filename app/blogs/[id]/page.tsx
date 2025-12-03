"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Clock } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import "./globals.css"

type BlogData = {
  id: string
  title: string
  titleAr: string
  excerpt: string
  excerptAr: string
  content: string
  contentAr: string
  coverImage: string | null
  category: string
  categoryAr: string
  readTime: string | null
  published: boolean
  createdAt: Date | null
  authorName: string | null
  authorEmail: string | null
}

export default function BlogPreviewPage() {
  const params = useParams()
  const id = params.id as string
  const { locale, t } = useI18n()
  const [blogData, setBlogData] = useState<BlogData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs?id=${id}`)
        const data = await response.json()
        if (data.success) {
          setBlogData(data.data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (error || !blogData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Blog not found</p>
          <Link href="/blogs" className="text-primary hover:underline">
            {t("blogs.backToAll")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link href="/blogs" className="flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("blogs.backToBlogs")}
          </Link>
        </div>
      </header>

      {/* Preview Banner for Unpublished Posts */}
      {!blogData.published && (
        <div className="bg-yellow-100 border-b border-yellow-200">
          <div className="container mx-auto px-6 py-3">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ {t("blogs.previewMode")}
            </p>
          </div>
        </div>
      )}

      {/* Blog Content */}
      <article className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Cover Image */}
        {blogData.coverImage && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={blogData.coverImage}
              alt={locale === "en" ? blogData.title : blogData.titleAr}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Category Badge */}
        {(locale === "en" ? blogData.category : blogData.categoryAr) && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {locale === "en" ? blogData.category : blogData.categoryAr}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" dir={locale === "ar" ? "rtl" : "ltr"}>
          {locale === "en" ? blogData.title : blogData.titleAr}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed" dir={locale === "ar" ? "rtl" : "ltr"}>
          {locale === "en" ? blogData.excerpt : blogData.excerptAr}
        </p>

        {/* Meta Information */}
        <div className="flex items-center gap-6 pb-8 mb-8 border-b border-gray-200">
          <div className="flex items-center text-gray-600">
            <User className="w-5 h-5 mr-2" />
            <span className="font-medium">{blogData.authorName || t("blogs.author")}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>
              {blogData.createdAt
                ? new Date(blogData.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown Date"}
            </span>
          </div>
          {blogData.readTime && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{blogData.readTime}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed"
            dir={locale === "ar" ? "rtl" : "ltr"}
            dangerouslySetInnerHTML={{ __html: locale === "en" ? blogData.content : blogData.contentAr }}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blogs"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("blogs.backToAll")}
          </Link>
        </div>
      </article>
    </div>
  )
}
