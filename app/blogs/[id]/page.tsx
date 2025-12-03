"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Target,
  Badge
} from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button" // Assuming you have shadcn button
import Navbar from "@/components/navbar"        // Import your actual Navbar
import Footer from "@/components/footer"        // Import your actual Footer
import "./globals.css"

// --- Types ---
type ContentBlock = {
  id: string
  type: "text" | "image"
  data?: string
  src?: string
  caption?: string
}

type BlogData = {
  id: string
  title: string
  titleAr?: string
  excerpt: string
  excerptAr?: string
  content: ContentBlock[] | string
  contentAr?: ContentBlock[] | string
  coverImage: string | null
  category: string
  categoryAr?: string
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

  // Fetch Logic
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

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-[#B99B75] rounded-full mb-4 animate-bounce"></div>
            <p className="text-[#324557] font-serif">{t('blogs.loadingArticle')}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // --- Error State ---
  if (error || !blogData) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-[#324557] font-serif">{t('blogs.notFound')}</h2>
            <Link href="/blogs">
              <Button className="bg-[#B99B75] hover:bg-[#a38663] text-white">
                {t("blogs.backToAll")}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Helper to get localized text
  const getLocalized = (en: string | undefined | null, ar: string | undefined | null) => {
    if (locale === "ar") return ar || en || "";
    return en || ar || "";
  }

  const title = getLocalized(blogData.title, blogData.titleAr);
  const excerpt = getLocalized(blogData.excerpt, blogData.excerptAr);
  const category = getLocalized(blogData.category, blogData.categoryAr);
  const content = locale === "en" ? blogData.content : (blogData.contentAr || blogData.content);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7]">
      <Navbar />

      {/* Preview Banner for Unpublished Posts */}
      {!blogData.published && (
        <div className="bg-amber-100 border-b border-amber-200 sticky top-[navbar-height] z-40">
          <div className="container mx-auto px-6 py-2 text-center">
            <p className="text-amber-800 text-sm font-medium flex items-center justify-center gap-2">
              ⚠️ {t("blogs.previewMode")}
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb / Back Button */}
          <div className="mb-8">
            <Link 
              href="/blogs" 
              className="inline-flex items-center text-[#5F83A4] hover:text-[#324557] transition-colors font-medium group"
            >
              <ArrowLeft className={`w-4 h-4 ${locale === 'ar' ? 'ml-2 rotate-180' : 'mr-2'} group-hover:-translate-x-1 transition-transform`} />
              {t("blogs.backToBlogs")}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* --- Main Content Area (8 Columns) --- */}
            <article className="lg:col-span-8">
              {/* Header Group */}
              <div className="mb-8">
                {category && (
                  <Badge className="mb-4 bg-[#B99B75]/10 text-[#B99B75] hover:bg-[#B99B75]/20 border-0 px-3 py-1 text-sm">
                    {category}
                  </Badge>
                )}
                
                <h1 className="text-3xl md:text-5xl font-bold text-[#324557] font-serif mb-6 leading-tight" dir={locale === "ar" ? "rtl" : "ltr"}>
                  {title}
                </h1>
                
                {/* Meta Data Row */}
                <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-[#E3D6C7] pb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#B99B75]" />
                    <span className="font-medium text-[#324557]">{blogData.authorName || t("blogs.author")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B99B75]" />
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
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#B99B75]" />
                      <span>{blogData.readTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              {blogData.coverImage && (
                <div className="rounded-2xl overflow-hidden mb-10 shadow-lg relative h-[400px] w-full">
                  <Image
                    src={blogData.coverImage}
                    alt={title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              )}

              {/* Excerpt (Intro) */}
              {excerpt && (
                <div className="mb-10 p-6 bg-white border-l-4 border-[#B99B75] rounded-r-lg shadow-sm">
                   <p className="text-xl text-gray-700 leading-relaxed font-medium italic" dir={locale === "ar" ? "rtl" : "ltr"}>
                      {excerpt}
                   </p>
                </div>
              )}

              {/* Main Body Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#324557] prose-p:text-gray-600 prose-a:text-[#B99B75] prose-img:rounded-xl"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                {(() => {
                  // Handle legacy string content (HTML)
                  if (typeof content === "string") {
                    return <div dangerouslySetInnerHTML={{ __html: content }} />
                  }

                  // Handle Block Content (Array)
                  if (Array.isArray(content)) {
                    return content.map((block) => {
                      if (block.type === "text" && block.data) {
                        return (
                          <div key={block.id} dangerouslySetInnerHTML={{ __html: block.data }} />
                        )
                      }

                      if (block.type === "image" && block.src) {
                        return (
                          <div key={block.id} className="my-10 not-prose">
                            <figure className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
                              <Image
                                src={block.src}
                                alt={block.caption || "Blog image"}
                                fill
                                className="object-cover"
                              />
                            </figure>
                            {block.caption && (
                              <figcaption className="text-sm text-gray-500 text-center mt-3 italic">
                                {block.caption}
                              </figcaption>
                            )}
                          </div>
                        )
                      }
                      return null
                    })
                  }
                  return null
                })()}
              </div>

              {/* Share Section */}
              <div className="flex items-center gap-4 border-t border-[#E3D6C7] pt-10 mt-12">
                <span className="font-bold text-[#324557] font-serif">{t('blogs.shareArticle')}</span>
                <div className="flex gap-2">
                   <Button variant="outline" size="icon" className="rounded-full hover:text-[#B99B75] hover:border-[#B99B75] transition-colors"><Facebook className="w-4 h-4"/></Button>
                   <Button variant="outline" size="icon" className="rounded-full hover:text-[#B99B75] hover:border-[#B99B75] transition-colors"><Twitter className="w-4 h-4"/></Button>
                   <Button variant="outline" size="icon" className="rounded-full hover:text-[#B99B75] hover:border-[#B99B75] transition-colors"><Linkedin className="w-4 h-4"/></Button>
                </div>
              </div>
            </article>

            {/* --- Sidebar (4 Columns) --- */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* CTA Widget */}
              <div className="bg-[#324557] rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B99B75] opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:opacity-20 transition-opacity"></div>

                <Target className="w-12 h-12 text-[#B99B75] mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold mb-3 relative z-10">{t('blogs.planStay')}</h3>
                <p className="text-gray-300 mb-6 relative z-10 leading-relaxed">
                  {t('blogs.planStayDesc')}
                </p>
                <Link href="/booking" className="block">
                  <Button className="w-full bg-[#B99B75] hover:bg-[#a38663] text-white font-bold py-6 relative z-10 transition-all shadow-lg hover:shadow-orange-900/20">
                    {t('blogs.bookNow')}
                  </Button>
                </Link>
              </div>

              {/* Recent Articles Widget (Mock Data - You can replace with real fetch later) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E3D6C7]">
                <h4 className="font-bold text-[#324557] text-lg mb-6 font-serif border-b border-gray-100 pb-2">
                  {t('blogs.recentArticles')}
                </h4>
                <div className="space-y-6">
                  {/* Placeholder items - in production, map these from a 'related posts' API call */}
                  {[1, 2, 3].map((item) => (
                    <Link key={item} href="/blogs" className="group block">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                           {/* Add logic to show thumbnail of other posts here */}
                           <div className="absolute inset-0 bg-[#324557]/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 group-hover:text-[#B99B75] transition-colors line-clamp-2 text-sm leading-snug">
                            Discover the spiritual journey of Hajj and Umrah with premium comfort.
                          </h5>
                          <span className="text-xs text-gray-400 mt-2 block flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> 5 min read
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                   <Link href="/blogs" className="text-sm font-bold text-[#B99B75] hover:text-[#324557] transition-colors">
                      {t('blogs.viewAllPosts')}
                   </Link>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}