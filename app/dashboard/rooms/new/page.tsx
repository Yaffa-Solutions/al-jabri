import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import RoomForm from "../room-form"

export default async function NewRoomPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="p-6">
      <RoomForm />
    </div>
  )
}

