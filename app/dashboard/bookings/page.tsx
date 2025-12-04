import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { bookings, users, hotels, rooms } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import DashboardBookings from "@/components/dashboard-bookings"

export default async function BookingsPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  // Fetch all bookings with related data
  const allBookings = await db
    .select({
      id: bookings.id,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      guests: bookings.guests,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      createdAt: bookings.createdAt,
      userName: users.name,
      userEmail: users.email,
      hotelName: hotels.name,
      roomType: rooms.type,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .leftJoin(rooms, eq(bookings.roomId, rooms.id))
    .leftJoin(hotels, eq(rooms.hotelId, hotels.id))
    .orderBy(desc(bookings.createdAt))

  const stats = {
    total: allBookings.length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  }

  return <DashboardBookings stats={stats} bookings={allBookings} />
}
