// Blog content block types
export type TextBlock = {
  type: "text"
  id: string
  data: string // Rich text HTML
}

export type ImageBlock = {
  type: "image"
  id: string
  src: string // S3 URL
  caption?: string
}

export type ContentBlock = TextBlock | ImageBlock

// Blog form data
export type BlogFormData = {
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

// Blog display data
export type Blog = {
  id: string
  authorId: string
  authorName?: string
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
  createdAt: Date | string
  updatedAt: Date | string
  publishedAt?: Date | string | null
}
