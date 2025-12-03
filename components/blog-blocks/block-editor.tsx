"use client"

import { useState } from "react"
import { Plus, Trash2, ChevronUp, ChevronDown, Type, Image as ImageIcon } from "lucide-react"
import { createId } from "@paralleldrive/cuid2"
import type { ContentBlock } from "@/types/blog"
import TextBlock from "./text-block"
import ImageBlock from "./image-block"

type BlockEditorProps = {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  dir?: "ltr" | "rtl"
}

export default function BlockEditor({ blocks, onChange, dir = "ltr" }: BlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)

  const addBlock = (type: "text" | "image") => {
    const newBlock: ContentBlock =
      type === "text"
        ? { type: "text", id: createId(), data: "" }
        : { type: "image", id: createId(), src: "", caption: "" }

    onChange([...blocks, newBlock])
    setShowAddMenu(false)
  }

  const updateBlock = (index: number, updatedBlock: Partial<ContentBlock>) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], ...updatedBlock } as ContentBlock
    onChange(newBlocks)
  }

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index))
  }

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === blocks.length - 1) return

    const newBlocks = [...blocks]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
    onChange(newBlocks)
  }

  return (
    <div className={`space-y-4 ${dir === "rtl" ? "rtl" : ""}`}>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="group relative border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white"
        >
          {/* Block Controls */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              type="button"
              onClick={() => moveBlock(index, "up")}
              disabled={index === 0}
              className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => moveBlock(index, "down")}
              disabled={index === blocks.length - 1}
              className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => deleteBlock(index)}
              className="p-1.5 bg-white border border-red-300 rounded hover:bg-red-50 shadow-sm"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>

          {/* Block Type Indicator */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600 flex items-center gap-1">
            {block.type === "text" ? (
              <>
                <Type className="w-3 h-3" />
                Text
              </>
            ) : (
              <>
                <ImageIcon className="w-3 h-3" />
                Image
              </>
            )}
          </div>

          {/* Block Content */}
          <div className="mt-8">
            {block.type === "text" ? (
              <TextBlock block={block} onChange={(data) => updateBlock(index, { data })} dir={dir} />
            ) : (
              <ImageBlock
                block={block}
                onChange={(src, caption) => updateBlock(index, { src, caption })}
                dir={dir}
              />
            )}
          </div>
        </div>
      ))}

      {/* Add Block Button */}
      <div className="relative">
        {showAddMenu ? (
          <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Choose a block type:</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => addBlock("text")}
                className="flex-1 flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Type className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Text</span>
                <span className="text-xs text-gray-500">Rich text content</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock("image")}
                className="flex-1 flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <ImageIcon className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Image</span>
                <span className="text-xs text-gray-500">Upload with caption</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMenu(false)}
              className="mt-3 w-full text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddMenu(true)}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add block</span>
          </button>
        )}
      </div>
    </div>
  )
}
