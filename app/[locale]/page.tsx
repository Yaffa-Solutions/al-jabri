import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { FeaturedHotels } from "@/components/featured-hotels"
import { AboutUs } from "@/components/about-us"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SearchBar />
        <FeaturedHotels />
        <AboutUs />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
