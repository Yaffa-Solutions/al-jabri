"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), { ssr: false })

type BlogFormProps = {
  authorId: string
  initialData?: {
    id: string
    title: string
    titleAr: string
    excerpt: string
    excerptAr: string
    content: string
    contentAr: string
    category: string
    categoryAr: string
    coverImage: string | null
    readTime: string | null
    published: boolean
  }
}

export default function BlogForm({ authorId, initialData }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    titleAr: initialData?.titleAr || "",
    excerpt: initialData?.excerpt || "",
    excerptAr: initialData?.excerptAr || "",
    content: initialData?.content || "",
    contentAr: initialData?.contentAr || "",
    category: initialData?.category || "",
    categoryAr: initialData?.categoryAr || "",
    coverImage: initialData?.coverImage || "",
    readTime: initialData?.readTime || "5 min read",
    published: initialData?.published || false,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, coverImage: data.data.url }))
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? "/api/blogs" : "/api/blogs"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published: publish,
          authorId,
          ...(initialData && { id: initialData.id }),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save blog")
      }

      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            {formData.coverImage && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              {imageUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm">
                {imageUploading ? "Uploading..." : "Upload Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
            </label>
          </div>
        </div>

        {/* English Fields */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">English Content</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write your blog content here..."
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Travel Tips, Hotel Reviews"
                required
              />
            </div>
          </div>
        </div>

        {/* Arabic Fields */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Arabic Content (المحتوى العربي)</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (العنوان) *
              </label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="rtl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (المقتطف) *
              </label>
              <textarea
                value={formData.excerptAr}
                onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="rtl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (المحتوى) *
              </label>
              <RichTextEditor
                value={formData.contentAr}
                onChange={(value) => setFormData({ ...formData, contentAr: value })}
                placeholder="اكتب محتوى المدونة هنا..."
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (الفئة) *
              </label>
              <input
                type="text"
                value={formData.categoryAr}
                onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="rtl"
                required
              />
            </div>
          </div>
        </div>

        {/* Read Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Read Time
          </label>
          <input
            type="text"
            value={formData.readTime}
            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., 5 min read"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            {initialData && (
              <Link
                href={`/blogs/${initialData.id}`}
                target="_blank"
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData?.published ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
