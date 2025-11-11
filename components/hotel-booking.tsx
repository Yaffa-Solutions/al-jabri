"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Users,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Dumbbell,
  Phone,
  Mail,
  CreditCard,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n-context"

export function HotelBooking() {
  const { locale, t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hotelId = searchParams.get("hotelId")
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const guests = searchParams.get("guests") || "2"

  const [hotel, setHotel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: checkIn,
    checkOut: checkOut,
    guests: guests,
    rooms: "1",
    specialRequests: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  })

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch("/api/hotels")
        const data = await response.json()

        if (data.success) {
          const foundHotel = data.data.find((h: any) => h.id === hotelId)
          if (foundHotel) {
            setHotel(foundHotel)
          } else {
            toast.error(t("Hotel not found"))
            router.push("/booking")
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching hotel:", error)
        toast.error(t("Failed to load hotel details"))
      } finally {
        setIsLoading(false)
      }
    }

    if (hotelId) {
      fetchHotel()
    } else {
      router.push("/booking")
    }
  }, [hotelId, router, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel.id,
          hotelName: locale === "ar" ? hotel.nameAr : hotel.name,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t("Booking Confirmed!"), {
          description: t("Your reservation has been confirmed. Check your email for details."),
        })

        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        toast.error(t("Booking Failed"), {
          description: data.error || t("Please try again"),
        })
      }
    } catch (error) {
      console.error("[v0] Booking error:", error)
      toast.error(t("Connection error"), {
        description: t("Please check your internet connection and try again"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#B99B75] mx-auto mb-4" />
          <p className="text-[#324557] text-xl">{t("Loading hotel details")}...</p>
        </div>
      </section>
    )
  }

  if (!hotel) {
    return null
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7] min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-[#324557] hover:text-[#B99B75] gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("Back to Search Results")}
          </Button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Hotel Details - Left Side */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-[#E3D6C7] sticky top-4">
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={locale === "ar" ? hotel.nameAr : hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#B99B75] text-white px-4 py-2 rounded-full text-lg font-bold">
                  ${hotel.price}/{t("night")}
                </div>
              </div>

              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#324557] mb-2">
                  {locale === "ar" ? hotel.nameAr : hotel.name}
                </h2>

                <div className="flex items-center text-[#5F83A4] mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{locale === "ar" ? hotel.locationAr : hotel.location}</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 fill-[#B99B75] text-[#B99B75]" />
                  <span className="font-bold text-[#324557] text-lg">{hotel.rating}</span>
                  <span className="text-[#5F83A4]">
                    ({hotel.reviews} {t("reviews")})
                  </span>
                </div>

                <div className="border-t border-[#E3D6C7] pt-4">
                  <h3 className="font-semibold text-[#324557] mb-3">{t("Amenities")}</h3>
                  <div className="flex gap-4 text-[#5F83A4]">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5" />
                      <span className="text-sm">{t("Free WiFi")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="w-5 h-5" />
                      <span className="text-sm">{t("Breakfast")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-5 h-5" />
                      <span className="text-sm">{t("Gym")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form - Right Side */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-[#E3D6C7]">
              <CardHeader>
                <CardTitle className="text-[#324557] text-2xl">{t("Complete Your Booking")}</CardTitle>
                <CardDescription>{t("Fill in your details to confirm your reservation")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#324557] text-lg">{t("Personal Information")}</h3>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t("Full Name")}</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder={t("Enter your full name")}
                        value={formData.fullName}
                        onChange={handleChange}
                        className="border-[#86A1BA] focus:border-[#B99B75]"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("Email Address")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("Phone Number")}</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+966 XX XXX XXXX"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#324557] text-lg">{t("Booking Details")}</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">{t("Check-in Date")}</Label>
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
                        <Label htmlFor="checkOut">{t("Check-out Date")}</Label>
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
                        <Label htmlFor="guests">{t("Guests")}</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                          <select
                            id="guests"
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-[#86A1BA] rounded-lg focus:outline-none focus:border-[#B99B75]"
                          >
                            <option value="1">1 {t("Guest")}</option>
                            <option value="2">2 {t("Guests")}</option>
                            <option value="3">3 {t("Guests")}</option>
                            <option value="4">4 {t("Guests")}</option>
                            <option value="5">5+ {t("Guests")}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rooms">{t("Rooms")}</Label>
                        <select
                          id="rooms"
                          name="rooms"
                          value={formData.rooms}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-[#86A1BA] rounded-lg focus:outline-none focus:border-[#B99B75]"
                        >
                          <option value="1">1 {t("Room")}</option>
                          <option value="2">2 {t("Rooms")}</option>
                          <option value="3">3 {t("Rooms")}</option>
                          <option value="4">4+ {t("Rooms")}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">
                        {t("Special Requests")} ({t("Optional")})
                      </Label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        placeholder={t("Any special requests or preferences?")}
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#86A1BA] rounded-lg focus:outline-none focus:border-[#B99B75] min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#324557] text-lg">{t("Payment Information")}</h3>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">{t("Card Number")}</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">{t("Expiry Date")}</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="border-[#86A1BA] focus:border-[#B99B75]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">{t("CVV")}</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          placeholder="123"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          className="border-[#86A1BA] focus:border-[#B99B75]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {t("Processing")}...
                      </>
                    ) : (
                      t("Confirm Booking")
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HotelBooking
