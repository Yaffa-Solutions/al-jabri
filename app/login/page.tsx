import Navbar from "@/components/navbar"
import LoginForm from "@/components/login-form"
import Footer from "@/components/footer"

export default function LoginPage() {
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
