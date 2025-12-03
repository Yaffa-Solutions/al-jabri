# Quick Start Guide - New Block-Based Blog System

## 🚀 Getting Started

### Setup (Development)

```bash
# 1. Drop old table (if exists)
psql $DATABASE_URL -c "DROP TABLE IF EXISTS blogs CASCADE;"

# 2. Push new schema
pnpm drizzle-kit push --force

# 3. Start using the new editor
# Navigate to: /dashboard/blogs/new
```

✅ **Migration complete!** The new block-based schema is now active.

---

## 📝 Creating a Blog Post

1. Go to `/dashboard/blogs/new`
2. Select language (EN/AR) in header
3. Fill in:
   - **Content Tab**: Title, Excerpt, Blocks
   - **Meta Tab**: Category, Tags, Read Time
   - **SEO Tab**: Meta Description, Keywords
4. Upload cover image (sidebar)
5. Click **Publish** or **Save as Draft**

---

## 🎨 Block Types

### Text Block
- Rich text editor (TipTap)
- Supports: Bold, Italic, Headings, Lists, Links, Images
- Auto-saves as HTML

### Image Block
- Click to upload
- Add optional caption
- Stores in S3

---

## 🔧 Key Files

| File | Purpose |
|------|---------|
| [app/dashboard/blogs/blog-form-v2.tsx](app/dashboard/blogs/blog-form-v2.tsx) | Main blog editor |
| [components/blog-blocks/block-editor.tsx](components/blog-blocks/block-editor.tsx) | Block management |
| [components/blog-blocks/block-renderer.tsx](components/blog-blocks/block-renderer.tsx) | Display blocks on frontend |
| [db/schema/blogs.ts](db/schema/blogs.ts) | Database schema |
| [types/blog.ts](types/blog.ts) | TypeScript types |

---

## 🌐 Displaying Blogs

```tsx
import BlockRenderer from "@/components/blog-blocks/block-renderer"

export default function BlogPost({ blog }) {
  return (
    <article>
      <h1>{blog.title}</h1>
      <p>{blog.excerpt}</p>

      <BlockRenderer
        blocks={blog.content}
        dir={blog.languageCode === "ar" ? "rtl" : "ltr"}
      />
    </article>
  )
}
```

---

## 🔍 Fetching Blogs

```typescript
// Get English blogs
const response = await fetch("/api/blogs?languageCode=en")

// Get Arabic blogs
const response = await fetch("/api/blogs?languageCode=ar")

// Get specific blog
const response = await fetch("/api/blogs?id=xyz")
```

---

## ⚙️ Block Structure

```typescript
// Text Block
{
  type: "text",
  id: "cuid...",
  data: "<p>HTML content...</p>"
}

// Image Block
{
  type: "image",
  id: "cuid...",
  src: "https://s3.../image.jpg",
  caption: "Image caption"
}
```

---

## 🛠️ Troubleshooting

### Blocks Not Saving
- Check browser console for errors
- Verify API route is receiving array
- Check network tab for request payload

### Language Not Switching
- Ensure `languageCode` is set in form
- Check `useI18n()` hook is working
- Verify `dir` attribute is applied

---

## 📚 Full Documentation

- [BLOG_REFACTORING_GUIDE.md](BLOG_REFACTORING_GUIDE.md) - Complete refactoring details

---

## ✅ Checklist

- [x] Database migration complete
- [ ] Test creating English blog
- [ ] Test creating Arabic blog
- [ ] Verify blocks display correctly
- [ ] Test image upload
- [ ] Test tags
- [ ] Update frontend display pages
- [ ] Remove old BlogForm component

---

**Need Help?** Check the full guides or contact the development team.
