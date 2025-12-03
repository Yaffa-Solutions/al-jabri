"use client"

import type { ContentBlock } from "@/types/blog"

type BlockRendererProps = {
  blocks: ContentBlock[]
  dir?: "ltr" | "rtl"
}

export default function BlockRenderer({ blocks, dir = "ltr" }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div className={`space-y-6 ${dir === "rtl" ? "rtl" : ""}`}>
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <div
                key={block.id}
                className="prose prose-lg max-w-none"
                dir={dir}
                dangerouslySetInnerHTML={{ __html: block.data }}
              />
            )

          case "image":
            if (!block.src) return null
            return (
              <figure key={block.id} className="my-8">
                <img
                  src={block.src}
                  alt={block.caption || "Blog image"}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                {block.caption && (
                  <figcaption className="mt-3 text-sm text-gray-600 text-center italic" dir={dir}>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          default:
            return null
        }
      })}

      <style jsx global>{`
        .prose {
          color: #374151;
        }
        .prose h1 {
          font-size: 2.25em;
          font-weight: 800;
          margin-top: 0;
          margin-bottom: 0.8888889em;
          line-height: 1.1111111;
          color: #111827;
        }
        .prose h2 {
          font-size: 1.875em;
          font-weight: 700;
          margin-top: 1.6em;
          margin-bottom: 0.8em;
          line-height: 1.2;
          color: #111827;
        }
        .prose h3 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
          line-height: 1.3333333;
          color: #111827;
        }
        .prose p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          line-height: 1.75;
        }
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
          font-weight: 500;
        }
        .prose a:hover {
          color: #2563eb;
        }
        .prose strong {
          font-weight: 600;
          color: #111827;
        }
        .prose ul,
        .prose ol {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          padding-left: 1.625em;
        }
        .prose li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .prose blockquote {
          font-weight: 500;
          font-style: italic;
          color: #111827;
          border-left-width: 0.25rem;
          border-left-color: #e5e7eb;
          quotes: "\\201C""\\201D""\\2018""\\2019";
          margin-top: 1.6em;
          margin-bottom: 1.6em;
          padding-left: 1em;
        }
        .prose code {
          color: #111827;
          font-weight: 600;
          font-size: 0.875em;
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
        }
        .prose pre {
          color: #e5e7eb;
          background-color: #1f2937;
          overflow-x: auto;
          font-size: 0.875em;
          line-height: 1.7142857;
          margin-top: 1.7142857em;
          margin-bottom: 1.7142857em;
          border-radius: 0.375rem;
          padding-top: 0.8571429em;
          padding-right: 1.1428571em;
          padding-bottom: 0.8571429em;
          padding-left: 1.1428571em;
        }
        .prose pre code {
          background-color: transparent;
          border-width: 0;
          border-radius: 0;
          padding: 0;
          font-weight: 400;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
        }
        .prose img {
          margin-top: 2em;
          margin-bottom: 2em;
        }
      `}</style>
    </div>
  )
}
