import { NextResponse, NextRequest } from "next/server"
import { db } from "@/db"
import { userActivities, users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { requireSuperAdmin } from "@/lib/middleware"

// GET all user activities (Super admin only)
export async function GET(request: NextRequest) {
  const session = await requireSuperAdmin()
  if (session instanceof NextResponse) return session

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "100")

    let activities

    if (userId) {
      // Get activities for specific user
      activities = await db
        .select()
        .from(userActivities)
        .where(eq(userActivities.userId, userId))
        .orderBy(desc(userActivities.createdAt))
        .limit(limit)
    } else {
      // Get all activities
      activities = await db.select().from(userActivities).orderBy(desc(userActivities.createdAt)).limit(limit)
    }

    // Get user information for each activity
    const activitiesWithUsers = await Promise.all(
      activities.map(async (activity) => {
        const [user] = await db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
          })
          .from(users)
          .where(eq(users.id, activity.userId))
          .limit(1)

        return {
          ...activity,
          user,
        }
      }),
    )

    return NextResponse.json({ success: true, data: activitiesWithUsers })
  } catch (error) {
    console.error("[v0] Error fetching activities:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch activities" }, { status: 500 })
  }
}
