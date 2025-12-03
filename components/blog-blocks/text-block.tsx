"use client"

import dynamic from "next/dynamic"
import type { TextBlock as TextBlockType } from "@/types/blog"

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), { ssr: false })

type TextBlockProps = {
  block: TextBlockType
  onChange: (data: string) => void
  dir?: "ltr" | "rtl"
}

export default function TextBlock({ block, onChange, dir = "ltr" }: TextBlockProps) {
  return (
    <div className="w-full">
      <RichTextEditor value={block.data} onChange={onChange} dir={dir} placeholder="Start writing..." />
    </div>
  )
}
