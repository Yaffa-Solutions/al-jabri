import { Navbar } from "@/components/navbar"
import { BookingForm } from "@/components/booking-form"
import { Footer } from "@/components/footer"

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BookingForm />
      </main>
      <Footer />
    </div>
  )
}
