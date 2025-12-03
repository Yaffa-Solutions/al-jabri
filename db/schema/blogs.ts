import { pgTable, varchar, timestamp, text, boolean, jsonb } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./users"

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

// Blogs table
export const blogs = pgTable("blogs", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  authorId: varchar("author_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Language code: 'en' or 'ar'
  languageCode: varchar("language_code", { length: 2 }).notNull().default("en"),

  // English content
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: jsonb("content").notNull().$type<ContentBlock[]>(),

  // Arabic content
  titleAr: varchar("title_ar", { length: 500 }),
  excerptAr: text("excerpt_ar"),
  contentAr: jsonb("content_ar").$type<ContentBlock[]>(),

  category: varchar("category", { length: 100 }).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),

  coverImage: text("cover_image"), // S3 URL

  readTime: varchar("read_time", { length: 50 }).default("5 min read"),

  published: boolean("published").default(false).notNull(),

  // SEO fields
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  publishedAt: timestamp("published_at", { mode: "date" }),
})
