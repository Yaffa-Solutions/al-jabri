import { NextResponse, NextRequest } from "next/server"
import { db } from "@/db"
import { blogs, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { logActivity } from "@/lib/activity-logger"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const languageCode = searchParams.get("languageCode") || "en"

    // Get specific blog by ID
    if (id) {
      const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)

      if (!blog) {
        return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 })
      }

      // Get author information
      const [author] = await db.select().from(users).where(eq(users.id, blog.authorId)).limit(1)

      const formattedBlog = {
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        tags: blog.tags || [],
        author: author?.name || "Unknown",
        authorName: author?.name || "Unknown",
        authorEmail: author?.email || null,
        date: blog.createdAt?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        createdAt: blog.createdAt,
        publishedAt: blog.publishedAt,
        coverImage: blog.coverImage,
        image: blog.coverImage,
        readTime: blog.readTime,
        published: blog.published,
        languageCode: blog.languageCode,
        metaDescription: blog.metaDescription,
        metaKeywords: blog.metaKeywords,
      }

      return NextResponse.json({ success: true, data: formattedBlog })
    }

    // Get all blogs or filter by category (only published blogs)
    let query = db.select().from(blogs).where(eq(blogs.published, true))

    const allBlogs = await query

    // Filter by category and language if provided
    let filteredBlogs = allBlogs
    if (category && category !== "all") {
      filteredBlogs = filteredBlogs.filter((b) => b.category === category)
    }
    if (languageCode) {
      filteredBlogs = filteredBlogs.filter((b) => b.languageCode === languageCode)
    }

    // Get author information for all blogs
    const blogsWithAuthors = await Promise.all(
      filteredBlogs.map(async (blog) => {
        const [author] = await db.select().from(users).where(eq(users.id, blog.authorId)).limit(1)

        return {
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category,
          tags: blog.tags || [],
          author: author?.name || "Unknown",
          authorName: author?.name || "Unknown",
          date: blog.createdAt?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
          createdAt: blog.createdAt,
          publishedAt: blog.publishedAt,
          coverImage: blog.coverImage,
          image: blog.coverImage,
          readTime: blog.readTime,
          languageCode: blog.languageCode,
        }
      }),
    )

    return NextResponse.json({ success: true, data: blogsWithAuthors })
  } catch (error) {
    console.error("[v0] Error fetching blogs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 })
  }
}

// Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      coverImage,
      readTime,
      published,
      authorId,
      languageCode,
      metaDescription,
      metaKeywords,
    } = body

    // Validate required fields
    if (!title || !excerpt || !content || !category || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate content is an array of blocks
    if (!Array.isArray(content)) {
      return NextResponse.json({ error: "Content must be an array of blocks" }, { status: 400 })
    }

    const [newBlog] = await db
      .insert(blogs)
      .values({
        title,
        excerpt,
        content,
        category,
        tags: tags || [],
        coverImage: coverImage || null,
        readTime: readTime || "5 min read",
        published: published || false,
        authorId,
        languageCode: languageCode || "en",
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        publishedAt: published ? new Date() : null,
      })
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "blog_created",
      details: { blogId: newBlog.id, title },
      request,
    })

    return NextResponse.json({ success: true, data: newBlog })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}

// Update blog post
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      title,
      excerpt,
      content,
      category,
      tags,
      coverImage,
      readTime,
      published,
      languageCode,
      metaDescription,
      metaKeywords,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    // Validate content is an array of blocks
    if (content && !Array.isArray(content)) {
      return NextResponse.json({ error: "Content must be an array of blocks" }, { status: 400 })
    }

    // Get current blog to check if we need to update publishedAt
    const [currentBlog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)

    if (!currentBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const shouldUpdatePublishedAt = published && !currentBlog.published

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        title,
        excerpt,
        content,
        category,
        tags: tags || [],
        coverImage: coverImage || null,
        readTime: readTime || "5 min read",
        published,
        languageCode: languageCode || "en",
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        updatedAt: new Date(),
        ...(shouldUpdatePublishedAt && { publishedAt: new Date() }),
      })
      .where(eq(blogs.id, id))
      .returning()

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "blog_updated",
      details: { blogId: id, title },
      request,
    })

    return NextResponse.json({ success: true, data: updatedBlog })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

// Toggle publish status
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, published } = body

    if (!id || published === undefined) {
      return NextResponse.json({ error: "Blog ID and published status are required" }, { status: 400 })
    }

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        published,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
      .returning()

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: published ? "blog_published" : "blog_unpublished",
      details: { blogId: id, title: updatedBlog.title },
      request,
    })

    return NextResponse.json({ success: true, data: updatedBlog })
  } catch (error) {
    console.error("Error toggling blog publish status:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

// Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    // Get blog info before deleting for activity log
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id))

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    await db.delete(blogs).where(eq(blogs.id, id))

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "blog_deleted",
      details: { blogId: id, title: blog.title },
      request,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
