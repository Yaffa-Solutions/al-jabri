"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Plus } from "lucide-react"
import { createId } from "@paralleldrive/cuid2"
import { useI18n } from "@/lib/i18n-context"
import type { BlogFormData, ContentBlock } from "@/types/blog"
import BlockEditor from "@/components/blog-blocks/block-editor"

type BlogFormV2Props = {
  authorId: string
  initialData?: {
    id: string
    title: string
    excerpt: string
    content: ContentBlock[]
    category: string
    tags: string[]
    coverImage: string | null
    readTime: string
    published: boolean
    languageCode: "en" | "ar"
    metaDescription?: string
    metaKeywords?: string
  }
}

export default function BlogFormV2({ authorId, initialData }: BlogFormV2Props) {
  const router = useRouter()
  const { locale, setLocale, t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"content" | "meta" | "seo">("content")
  const [tagInput, setTagInput] = useState("")

  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || [{ type: "text", id: createId(), data: "" }],
    category: initialData?.category || "",
    tags: initialData?.tags || [],
    coverImage: initialData?.coverImage || null,
    readTime: initialData?.readTime || "5 min read",
    published: initialData?.published || false,
    languageCode: initialData?.languageCode || locale,
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: initialData?.metaKeywords || "",
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const formDataObj = new FormData()
      formDataObj.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (publish: boolean = false) => {
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

  const currentDir = formData.languageCode === "ar" ? "rtl" : "ltr"

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Main Content Area - Left Panel */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Header with Language Switcher */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialData ? t("blog.editor.editTitle") : t("blog.editor.title")}
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">{t("blog.editor.language")}:</label>
            <select
              value={formData.languageCode}
              onChange={(e) => {
                const newLang = e.target.value as "en" | "ar"
                setFormData({ ...formData, languageCode: newLang })
                setLocale(newLang)
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "content"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("blog.editor.content")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("meta")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "meta"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("blog.editor.meta")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "seo"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("blog.editor.seo")}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "content" && (
            <div className="space-y-6" dir={currentDir}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("blog.editor.postTitle")} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                  placeholder={t("blog.editor.enterTitle")}
                  dir={currentDir}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("blog.editor.excerpt")} *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("blog.editor.enterExcerpt")}
                  dir={currentDir}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Content Blocks *</label>
                <BlockEditor
                  blocks={formData.content}
                  onChange={(blocks) => setFormData({ ...formData, content: blocks })}
                  dir={currentDir}
                />
              </div>
            </div>
          )}

          {activeTab === "meta" && (
            <div className="space-y-6" dir={currentDir}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("blog.editor.category")} *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("blog.editor.enterCategory")}
                  dir={currentDir}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("blog.editor.tags")}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t("blog.editor.addTag")}
                    dir={currentDir}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-blue-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("blog.editor.readTime")}
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5 min read"
                />
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("blog.editor.metaDescription")}
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("blog.editor.enterMetaDesc")}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.metaDescription?.length || 0} / 160</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("blog.editor.metaKeywords")}
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("blog.editor.enterMetaKeywords")}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Meta Settings */}
      <div className="w-80 bg-white rounded-lg shadow border border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Publishing</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("blog.editor.coverImage")}
                </label>
                {formData.coverImage ? (
                  <div className="relative group">
                    <img
                      src={formData.coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: null })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    {imageUploading ? (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Upload image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{t("blog.editor.published")}</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.published ? "Post is visible to everyone" : "Post is saved as draft"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("blog.editor.saveDraft")}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("blog.editor.publish")}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
              >
                {t("blog.editor.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
