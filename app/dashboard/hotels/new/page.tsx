import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import HotelFormWizard from "../hotel-form-wizard"

export default async function NewHotelPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="p-6">
      <HotelFormWizard />
    </div>
  )
}

