import { NextResponse } from "next/server"

// In-memory storage for contact messages
const messages: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "subject", "message"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Create new message
    const newMessage = {
      id: `MSG${Date.now()}`,
      ...body,
      date: new Date().toISOString(),
      status: "received",
    }

    messages.push(newMessage)

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: "Message sent successfully. We will get back to you soon!",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({ success: true, data: messages })
}
