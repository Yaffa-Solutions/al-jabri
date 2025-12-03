"use client"

import { useState } from "react"
import { Upload, Loader2, X } from "lucide-react"
import type { ImageBlock as ImageBlockType } from "@/types/blog"

type ImageBlockProps = {
  block: ImageBlockType
  onChange: (src: string, caption?: string) => void
  dir?: "ltr" | "rtl"
}

export default function ImageBlock({ block, onChange, dir = "ltr" }: ImageBlockProps) {
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState(block.caption || "")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
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
      onChange(data.data.url, caption)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleCaptionChange = (newCaption: string) => {
    setCaption(newCaption)
    onChange(block.src, newCaption)
  }

  const handleRemoveImage = () => {
    onChange("", caption)
  }

  return (
    <div className={`w-full ${dir === "rtl" ? "rtl" : ""}`}>
      {block.src ? (
        <div className="space-y-3">
          <div className="relative group rounded-lg overflow-hidden border border-gray-200">
            <img src={block.src} alt={caption || "Blog image"} className="w-full h-auto object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={caption}
            onChange={(e) => handleCaptionChange(e.target.value)}
            placeholder="Add a caption (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            dir={dir}
          />
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload an image</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  )
}
