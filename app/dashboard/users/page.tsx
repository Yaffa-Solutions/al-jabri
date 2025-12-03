import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { desc } from "drizzle-orm"
import UserManagementClient from "./user-management-client"

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage user accounts and permissions
        </p>
      </div>

      <UserManagementClient users={allUsers} currentUserId={session.user.id} />
    </div>
  )
}
