import { auth } from "@/lib/auth"
import { db } from "@/db"
import { users, bookings, hotels, blogs } from "@/db/schema"
import { count } from "drizzle-orm"
import { Hotel, Users, CalendarDays, FileText } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  // Get statistics
  const [totalUsers] = await db.select({ count: count() }).from(users)
  const [totalBookings] = await db.select({ count: count() }).from(bookings)
  const [totalHotels] = await db.select({ count: count() }).from(hotels)
  const [totalBlogs] = await db.select({ count: count() }).from(blogs)

  const stats = [
    {
      name: "Total Users",
      value: totalUsers?.count || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Total Bookings",
      value: totalBookings?.count || 0,
      icon: CalendarDays,
      color: "bg-green-500",
    },
    {
      name: "Total Hotels",
      value: totalHotels?.count || 0,
      icon: Hotel,
      color: "bg-purple-500",
    },
    {
      name: "Total Blogs",
      value: totalBlogs?.count || 0,
      icon: FileText,
      color: "bg-orange-500",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity or other widgets can go here */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/bookings"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <CalendarDays className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold">Manage Bookings</h3>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all hotel bookings
            </p>
          </a>
          <a
            href="/dashboard/hotels"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <Hotel className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold">Manage Hotels</h3>
            <p className="text-sm text-gray-600 mt-1">
              Add or edit hotel information
            </p>
          </a>
          <a
            href="/dashboard/blogs"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold">Manage Blogs</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create and publish blog posts
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
