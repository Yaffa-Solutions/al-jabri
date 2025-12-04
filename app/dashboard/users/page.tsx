import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { desc } from "drizzle-orm"
import DashboardUsers from "@/components/dashboard-users"

export default async function UsersPage() {
  const session = await auth()

  // Only super-admin can access this page
  if (!session?.user || session.user.role !== "super-admin") {
    redirect("/dashboard")
  }

  // Fetch all users
  const allUsers = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    image: users.image,
    createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt))

  return <DashboardUsers users={allUsers} currentUserId={session.user.id} />
}
