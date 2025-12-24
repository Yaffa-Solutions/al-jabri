import HeroSection from "@/components/hero-section"
import HeroMarketingStrip from "@/components/hero-marketing-strip"
import TrustStrip from "@/components/trust-strip"
import SpecialOffers from "@/components/special-offers"
import MarketingBanner from "@/components/marketing-banner"
import StatisticsSection from "@/components/statistics-section"
import Destinations from "@/components/destinations"
import FeaturedHotels from "@/components/featured-hotels"
import AboutUs from "@/components/about-us"
import Testimonials from "@/components/testimonials"
import Features from "@/components/features"
import CTASection from "@/components/cta-section"
import FAQSection from "@/components/faq-section"
import PaymentPartners from "@/components/payment-partners"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section with full-screen slider */}
        <HeroSection />
        
        {/* Marketing Strip with stats - replaces search bar */}
        <HeroMarketingStrip />
        
        {/* Trust Strip - Best Price, 24/7 Support, etc. */}
        <TrustStrip />
        
        {/* Special Offers & Promotions */}
        <SpecialOffers />
        
        {/* Marketing Banner - Gold variant */}
        <MarketingBanner variant="gold" />
        
        {/* Statistics Counter Section */}
        <StatisticsSection />
        
        {/* Our Destinations - Hotels by Location */}
        <Destinations />
        
        {/* Marketing Quote - Minimal */}
        <MarketingBanner variant="minimal" />
        
        {/* Featured Hotels Grid */}
        <FeaturedHotels />
        
        {/* About Us Section */}
        <AboutUs />
        
        {/* Marketing Banner - Image with parallax */}
        <MarketingBanner variant="image" />
        
        {/* Guest Testimonials */}
        <Testimonials />
        
        {/* Services/Features Section */}
        <Features />
        
        {/* CTA Section with contact options */}
        <CTASection />
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* Payment Methods & Security */}
        <PaymentPartners />
      </main>
      <Footer />
    </div>
  )
}
