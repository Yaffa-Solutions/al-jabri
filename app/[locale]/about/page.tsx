import { Navbar } from "@/components/navbar"
import { AboutDetails } from "@/components/about-details"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutDetails />
      </main>
      <Footer />
    </div>
  )
}
