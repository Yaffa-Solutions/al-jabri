"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import { useEffect, useState } from "react"

type Blog = {
  id: string
  title: string
  titleAr: string
  excerpt: string
  excerptAr: string
  coverImage: string | null
  category: string
  categoryAr: string
  readTime: string | null
  createdAt: Date | null
  authorName: string | null
}

export function BlogGrid() {
  const { locale, t } = useI18n()
  const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs")
        const data = await response.json()
        if (data.success) {
          setPublishedBlogs(data.data.slice(0, 6))
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#5F83A4]">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#324557] mb-4">
            {locale === "en" ? t("blogs.title") : t("blogs.arabicTitle")}
          </h1>
          <h2 className="text-3xl font-bold text-[#B99B75] mb-4" dir={locale === "ar" ? "rtl" : "ltr"}>
            {locale === "ar" ? t("blogs.title") : t("blogs.arabicTitle")}
          </h2>
          <p className="text-lg text-[#5F83A4] max-w-2xl mx-auto">
            {t("blogs.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs.length > 0 ? (
            publishedBlogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.id}`}>
                <Card className="bg-white border-[#E3D6C7] hover:shadow-xl transition-shadow overflow-hidden h-full">
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={locale === "en" ? blog.title : blog.titleAr}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-[#86A1BA] mb-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{blog.authorName || t("blogs.author")}</span>
                      </div>
                      {blog.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{blog.readTime}</span>
                        </div>
                      )}
                    </div>
                    {(locale === "en" ? blog.category : blog.categoryAr) && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2 w-fit">
                        {locale === "en" ? blog.category : blog.categoryAr}
                      </span>
                    )}
                    <CardTitle className="text-[#324557] hover:text-[#B99B75] transition-colors" dir={locale === "ar" ? "rtl" : "ltr"}>
                      {locale === "en" ? blog.title : blog.titleAr}
                    </CardTitle>
                    <CardDescription className="text-[#5F83A4] line-clamp-3" dir={locale === "ar" ? "rtl" : "ltr"}>
                      {locale === "en" ? blog.excerpt : blog.excerptAr}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="text-[#B99B75] hover:text-[#CEB89E] hover:bg-[#F7F4F0] gap-2 p-0">
                      {t("blogs.readMore")}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#5F83A4] text-lg">
                {t("blogs.noBlogs")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BlogGrid
