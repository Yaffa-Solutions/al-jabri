import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { blogs } from "@/db/schema"
import { eq } from "drizzle-orm"
import BlogFormV2 from "../../blog-form-v2"

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  const { id } = await params

  // Fetch the blog post
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id))

  if (!blog) {
    redirect("/dashboard/blogs")
  }

  return (
    <div className="p-6">
      <BlogFormV2
        authorId={session.user.id}
        initialData={{
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          titleAr: blog.titleAr,
          excerptAr: blog.excerptAr,
          contentAr: blog.contentAr,
          category: blog.category,
          tags: blog.tags || [],
          coverImage: blog.coverImage,
          readTime: blog.readTime || '5 min read',
          published: blog.published,
          languageCode: (blog.languageCode || 'en') as 'en' | 'ar',
        }}
      />
    </div>
  )
}
