import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { blogs, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import Image from "next/image"
import { Calendar, User } from "lucide-react"
import Link from "next/link"
import BlogListClient from "./blog-list-client"

export default async function BlogsPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  // Fetch all blogs with author info
  const allBlogs = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      excerpt: blogs.excerpt,
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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs Management</h1>
          <p className="text-gray-600 mt-2">Create and manage blog posts</p>
        </div>
        <Link href="/dashboard/blogs/new" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Create New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Posts</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
      </div>

      {/* Blogs List */}
      <BlogListClient blogs={allBlogs} />
    </div>
  )
}
