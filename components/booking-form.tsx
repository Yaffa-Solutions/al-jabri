"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, MapPin, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function BookingForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const queryParams = new URLSearchParams({
        destination: formData.location,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
      })

      const response = await fetch(`/api/search?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        const hotelsFound = data.data.hotels.length

        if (hotelsFound > 0) {
          toast.success(`Found ${hotelsFound} hotel${hotelsFound > 1 ? "s" : ""}!`, {
            description: "Showing available options for your dates",
          })

          // Store search results and redirect
          sessionStorage.setItem("searchResults", JSON.stringify(data.data))
          setTimeout(() => {
            router.push("/booking/results")
          }, 1000)
        } else {
          toast.info("No hotels found", {
            description: "Try adjusting your search criteria",
          })
        }
      } else {
        toast.error("Search failed", {
          description: data.error || "Please try again",
        })
      }
    } catch (error) {
      console.error("[v0] Booking form error:", error)
      toast.error("Connection error", {
        description: "Please check your internet connection and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#324557] via-[#48647E] to-[#5F83A4] min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Start Booking Your Stay Now</h1>
          <h2 className="text-3xl font-bold text-[#B99B75] mb-4" dir="rtl">
            ابدأ حجز إقامتك الآن
          </h2>
          <p className="text-lg text-[#E3D6C7] max-w-2xl mx-auto">
            Find and book your perfect hotel accommodation with our easy-to-use booking system
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur border-[#E3D6C7]">
          <CardHeader>
            <CardTitle className="text-[#324557] text-2xl">Search for Hotels</CardTitle>
            <CardDescription>Enter your travel details to find available accommodations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#324557] font-semibold">
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter city or hotel name"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn" className="text-[#324557] font-semibold">
                    Check-in Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                    <Input
                      id="checkIn"
                      name="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={handleChange}
                      className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut" className="text-[#324557] font-semibold">
                    Check-out Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                    <Input
                      id="checkOut"
                      name="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={handleChange}
                      className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-[#324557] font-semibold">
                    Guests
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#86A1BA] rounded-lg focus:outline-none focus:border-[#B99B75]"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rooms" className="text-[#324557] font-semibold">
                    Rooms
                  </Label>
                  <select
                    id="rooms"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#86A1BA] rounded-lg focus:outline-none focus:border-[#B99B75]"
                  >
                    <option value="1">1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>
                    <option value="4">4+ Rooms</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold text-lg py-6 gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Hotels
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-2xl font-bold text-[#B99B75] mb-2">50+</h3>
            <p className="text-[#E3D6C7]">Hotels Available</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-2xl font-bold text-[#B99B75] mb-2">24/7</h3>
            <p className="text-[#E3D6C7]">Customer Support</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-2xl font-bold text-[#B99B75] mb-2">Best Price</h3>
            <p className="text-[#E3D6C7]">Guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
