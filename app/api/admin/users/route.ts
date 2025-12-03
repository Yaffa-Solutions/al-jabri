import { NextResponse, NextRequest } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireSuperAdmin } from "@/lib/middleware"
import { logActivity, ActivityActions } from "@/lib/activity-logger"

// GET all users (Super admin only)
export async function GET(request: NextRequest) {
  const session = await requireSuperAdmin()
  if (session instanceof NextResponse) return session

  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      role: users.role,
      image: users.image,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users)

    return NextResponse.json({ success: true, data: allUsers })
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

// PUT update user (Super admin only)
export async function PUT(request: NextRequest) {
  const session = await requireSuperAdmin()
  if (session instanceof NextResponse) return session

  try {
    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ success: false, error: "userId and role are required" }, { status: 400 })
    }

    // Validate role
    if (!["user", "admin", "super-admin"].includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 })
    }

    // Update user role
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning()

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: ActivityActions.USER_ROLE_CHANGED,
      details: {
        targetUserId: userId,
        newRole: role,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "User role updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE user (Super admin only)
export async function DELETE(request: NextRequest) {
  const session = await requireSuperAdmin()
  if (session instanceof NextResponse) return session

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Don't allow deleting yourself
    if (userId === session.user.id) {
      return NextResponse.json({ success: false, error: "Cannot delete your own account" }, { status: 400 })
    }

    // Delete user (cascade will delete related records)
    await db.delete(users).where(eq(users.id, userId))

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: ActivityActions.USER_DELETED,
      details: {
        deletedUserId: userId,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
