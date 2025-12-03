import { db } from "@/db"
import { userActivities } from "@/db/schema"
import { NextRequest } from "next/server"

interface LogActivityOptions {
  userId: string
  action: string
  details?: Record<string, any>
  request?: NextRequest
}

/**
 * Log user activity to the database
 */
export async function logActivity({ userId, action, details, request }: LogActivityOptions) {
  try {
    const ipAddress = request
      ? request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
      : "unknown"

    const userAgent = request ? request.headers.get("user-agent") || "unknown" : "unknown"

    await db.insert(userActivities).values({
      userId,
      action,
      details: details || {},
      ipAddress,
      userAgent,
    })
  } catch (error) {
    console.error("[v0] Failed to log activity:", error)
    // Don't throw error to prevent disrupting the main flow
  }
}

// Common activity actions
export const ActivityActions = {
  // Auth
  LOGIN: "login",
  LOGOUT: "logout",
  REGISTER: "register",
  PASSWORD_CHANGED: "password_changed",

  // Bookings
  BOOKING_CREATED: "booking_created",
  BOOKING_UPDATED: "booking_updated",
  BOOKING_CANCELLED: "booking_cancelled",

  // Profile
  PROFILE_UPDATED: "profile_updated",
  PROFILE_IMAGE_UPDATED: "profile_image_updated",

  // Admin actions
  HOTEL_CREATED: "hotel_created",
  HOTEL_UPDATED: "hotel_updated",
  HOTEL_DELETED: "hotel_deleted",
  ROOM_CREATED: "room_created",
  ROOM_UPDATED: "room_updated",
  ROOM_DELETED: "room_deleted",
  OFFER_CREATED: "offer_created",
  OFFER_UPDATED: "offer_updated",
  OFFER_DELETED: "offer_deleted",
  BLOG_CREATED: "blog_created",
  BLOG_UPDATED: "blog_updated",
  BLOG_DELETED: "blog_deleted",

  // Super admin actions
  USER_ROLE_CHANGED: "user_role_changed",
  USER_DELETED: "user_deleted",
  USER_SUSPENDED: "user_suspended",
} as const
