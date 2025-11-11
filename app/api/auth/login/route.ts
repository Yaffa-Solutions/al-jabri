import { NextResponse } from "next/server"

// Dummy users for authentication
const users = [
  {
    id: "1",
    email: "admin@hotels.com",
    password: "admin123", // In production, use hashed passwords
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
    role: "user",
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Create session token (simplified version)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    // Return user data without password
    const { password: _, ...userData } = user

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        token,
      },
      message: "Login successful",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
