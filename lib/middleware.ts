import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "./auth"

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  return session
}

/**
 * Middleware to check if user is an admin or super-admin
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "admin" && session.user.role !== "super-admin") {
    return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 })
  }

  return session
}

/**
 * Middleware to check if user is a super-admin
 */
export async function requireSuperAdmin() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "super-admin") {
    return NextResponse.json({ success: false, error: "Forbidden: Super admin access required" }, { status: 403 })
  }

  return session
}
