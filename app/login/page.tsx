import Navbar from "@/components/navbar"
import LoginForm from "@/components/login-form"
import Footer from "@/components/footer"
import { redirect } from "next/navigation"

export default function LoginPage() {
  redirect("/auth/login")
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
