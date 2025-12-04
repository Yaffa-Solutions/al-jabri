import { auth } from "@/lib/auth"
import { db } from "@/db"
import { users, bookings, hotels, blogs } from "@/db/schema"
import { count } from "drizzle-orm"
import DashboardHome from "@/components/dashboard-home"

export default async function DashboardPage() {
  const session = await auth()

  // Get statistics
  const [totalUsers] = await db.select({ count: count() }).from(users)
  const [totalBookings] = await db.select({ count: count() }).from(bookings)
  const [totalHotels] = await db.select({ count: count() }).from(hotels)
  const [totalBlogs] = await db.select({ count: count() }).from(blogs)

  const stats = {
    totalUsers: totalUsers?.count || 0,
    totalBookings: totalBookings?.count || 0,
    totalHotels: totalHotels?.count || 0,
    totalBlogs: totalBlogs?.count || 0,
  }

  return <DashboardHome stats={stats} userName={session?.user?.name || ''} />
}
