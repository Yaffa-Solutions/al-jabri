import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import BlogFormV2 from "../blog-form-v2"

export default async function NewBlogPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="p-6">
      <BlogFormV2 authorId={session.user.id} />
    </div>
  )
}
