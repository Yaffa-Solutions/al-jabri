import { NextResponse } from "next/server"

// In-memory storage for newsletter subscribers
const subscribers: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    // Check if already subscribed
    if (subscribers.some((sub) => sub.email === email)) {
      return NextResponse.json({ success: false, error: "Email already subscribed" }, { status: 409 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Add subscriber
    const newSubscriber = {
      id: `SUB${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString(),
      status: "active",
    }

    subscribers.push(newSubscriber)

    return NextResponse.json({
      success: true,
      data: newSubscriber,
      message: "Successfully subscribed to newsletter!",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 })
  }
}

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({ success: true, data: subscribers })
}
