import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { AboutUs } from "@/components/about-us"
import { FeaturedHotels } from "@/components/featured-hotels"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SearchBar />
      <div id="about">
        <AboutUs />
      </div>
      <div id="hotels">
        <FeaturedHotels />
      </div>
      <div id="services">
        <Features />
      </div>
      <Footer />
    </main>
  )
}
