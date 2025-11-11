import Navbar from "@/components/navbar"
import AboutDetails from "@/components/about-details"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutDetails />
      </main>
      <Footer />
    </div>
  )
}
