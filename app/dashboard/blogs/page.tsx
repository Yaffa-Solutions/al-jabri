import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { blogs, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import DashboardBlogs from "@/components/dashboard-blogs"

export default async function BlogsPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  // Fetch all blogs with author info (including Arabic content)
  const allBlogs = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      titleAr: blogs.titleAr,
      excerpt: blogs.excerpt,
      excerptAr: blogs.excerptAr,
      content: blogs.content,
      coverImage: blogs.coverImage,
      category: blogs.category,
      readTime: blogs.readTime,
      published: blogs.published,
      createdAt: blogs.createdAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(blogs)
    .leftJoin(users, eq(blogs.authorId, users.id))
    .orderBy(desc(blogs.createdAt))

  const stats = {
    total: allBlogs.length,
    published: allBlogs.filter((b) => b.published).length,
    draft: allBlogs.filter((b) => !b.published).length,
  }

  return <DashboardBlogs stats={stats} blogs={allBlogs} />
}
