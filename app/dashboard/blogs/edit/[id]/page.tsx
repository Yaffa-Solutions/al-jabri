import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { blogs } from "@/db/schema"
import { eq } from "drizzle-orm"
import BlogForm from "../../blog-form"

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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-600 mt-2">Update your blog article</p>
      </div>

      <BlogForm
        authorId={session.user.id}
        initialData={{
          id: blog.id,
          title: blog.title,
          titleAr: blog.titleAr,
          excerpt: blog.excerpt,
          excerptAr: blog.excerptAr,
          content: blog.content,
          contentAr: blog.contentAr,
          category: blog.category,
          categoryAr: blog.categoryAr,
          coverImage: blog.coverImage,
          readTime: blog.readTime,
          published: blog.published,
        }}
      />
    </div>
  )
}
