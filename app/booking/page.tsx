"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import BookingForm from "@/components/booking-form"
import HotelBooking from "@/components/hotel-booking"
import Footer from "@/components/footer"

function BookingContent() {
  const searchParams = useSearchParams()
  const hotelId = searchParams.get("hotelId")

  // If hotelId is present, show hotel booking page
  // Otherwise show search form
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{hotelId ? <HotelBooking /> : <BookingForm />}</main>
      <Footer />
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-[#324557] text-xl">Loading...</div>
          </main>
          <Footer />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
