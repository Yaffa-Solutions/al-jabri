import Navbar from "@/components/navbar"
import BookingForm from "@/components/booking-form"
import Footer from "@/components/footer"

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <BookingForm />
      </main>
      <Footer />
    </div>
  )
}
