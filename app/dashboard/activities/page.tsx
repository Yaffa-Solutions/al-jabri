import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { userActivities, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import DashboardActivities from "@/components/dashboard-activities"

export default async function ActivitiesPage() {
  const session = await auth()

  // Only super-admin can access this page
  if (!session?.user || session.user.role !== "super-admin") {
    redirect("/dashboard")
  }

  // Fetch all activities with user info
  const allActivities = await db
    .select({
      id: userActivities.id,
      userId: userActivities.userId,
      action: userActivities.action,
      details: userActivities.details,
      ipAddress: userActivities.ipAddress,
      userAgent: userActivities.userAgent,
      createdAt: userActivities.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(userActivities)
    .leftJoin(users, eq(userActivities.userId, users.id))
    .orderBy(desc(userActivities.createdAt))
    .limit(100)

  return <DashboardActivities activities={allActivities} />
}
