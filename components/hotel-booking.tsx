"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
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
  Bed,
  DollarSign,
  CheckCircle2,
  X,
  Sparkles,
  ConciergeBell,
  Shirt,
  Plane,
  Flower2,
  Clock,
  Home,
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
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: checkIn,
    checkOut: checkOut,
    guests: guests,
    roomId: "",
    specialRequests: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  })

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels?id=${hotelId}`)
        const data = await response.json()

        if (data.success && data.data) {
          setHotel(data.data)
          // Auto-select first available room if exists
          if (data.data.rooms && data.data.rooms.length > 0) {
            const firstAvailableRoom = data.data.rooms.find((r: any) => r.available > 0) || data.data.rooms[0]
            if (firstAvailableRoom) {
              setSelectedRoomId(firstAvailableRoom.id)
              setFormData(prev => ({ ...prev, roomId: firstAvailableRoom.id }))
            }
          }
        } else {
          toast.error(t("Hotel not found"))
          router.push("/booking")
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
    
    if (!selectedRoomId) {
      toast.error(t("Please select a room"))
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel.id,
          roomId: selectedRoomId,
          hotelName: locale === "ar" ? hotel.nameAr : hotel.name,
          addOns: Array.from(selectedAddOns),
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

  const getRoomType = (room: any) => locale === "ar" && room.typeAr ? room.typeAr : room.type
  const getRoomDescription = (room: any) => locale === "ar" && room.descriptionAr ? room.descriptionAr : room.description
  const getBedType = (room: any) => locale === "ar" && room.bedTypeAr ? room.bedTypeAr : room.bedType

  const selectedRoom = hotel?.rooms?.find((r: any) => r.id === selectedRoomId)
  const totalPrice = selectedRoom ? Number(selectedRoom.price) : 0
  const addOnsTotal = selectedRoom?.addOns
    ?.filter((addOn: any) => selectedAddOns.has(addOn.id) && !addOn.included)
    .reduce((sum: number, addOn: any) => sum + (addOn.price || 0), 0) || 0

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
          {/* Hotel Details & Rooms - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Info Card */}
            <Card className="bg-white border-[#E3D6C7] sticky top-4">
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                {hotel.mainImage ? (
                  <Image
                    src={hotel.mainImage}
                    alt={locale === "ar" ? hotel.nameAr : hotel.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                {hotel.price && (
                  <div className="absolute top-4 right-4 bg-[#B99B75] text-white px-4 py-2 rounded-full text-lg font-bold">
                    {hotel.price} {hotel.rooms?.[0]?.currency || "SAR"}/{t("night")}
                  </div>
                )}
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

                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="border-t border-[#E3D6C7] pt-4">
                    <h3 className="font-semibold text-[#324557] mb-3">{t("Amenities")}</h3>
                    <div className="flex flex-wrap gap-2 text-[#5F83A4]">
                      {hotel.amenities.slice(0, 6).map((amenity: string, idx: number) => (
                        <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rooms Selection */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <Card className="bg-white border-[#E3D6C7]">
                <CardHeader>
                  <CardTitle className="text-[#324557] text-xl">{t("Available Rooms")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hotel.rooms.map((room: any) => (
                    <div
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id)
                        setFormData(prev => ({ ...prev, roomId: room.id }))
                        setSelectedAddOns(new Set())
                      }}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedRoomId === room.id
                          ? "border-[#B99B75] bg-[#F7F4F0]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#324557] mb-1">
                            {getRoomType(room)}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-[#5F83A4] mb-2">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {room.maxGuests} {t("guests")}
                            </span>
                            {room.bedType && (
                              <span className="flex items-center">
                                <Bed className="w-4 h-4 mr-1" />
                                {getBedType(room)}
                              </span>
                            )}
                            {room.size && (
                              <span>{room.size} sqm</span>
                            )}
                          </div>
                          {getRoomDescription(room) && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {getRoomDescription(room)}
                            </p>
                          )}
                          {room.amenities && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {room.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                                <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-xl font-bold text-[#B99B75]">
                            {room.price} {room.currency}
                          </div>
                          <div className="text-xs text-gray-500">{t("per night")}</div>
                          {room.available > 0 ? (
                            <div className="text-xs text-green-600 mt-1">
                              {room.available} {t("available")}
                            </div>
                          ) : (
                            <div className="text-xs text-red-600 mt-1">{t("Fully booked")}</div>
                          )}
                        </div>
                      </div>
                      {selectedRoomId === room.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-sm font-semibold text-[#324557] mb-2">
                            {t("Add-on Options")}:
                          </div>
                          {room.addOns && room.addOns.length > 0 ? (
                            <div className="space-y-2">
                              {room.addOns.map((addOn: any) => (
                                <label
                                  key={addOn.id}
                                  className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedAddOns.has(addOn.id)}
                                      onChange={(e) => {
                                        const newSet = new Set(selectedAddOns)
                                        if (e.target.checked) {
                                          newSet.add(addOn.id)
                                        } else {
                                          newSet.delete(addOn.id)
                                        }
                                        setSelectedAddOns(newSet)
                                      }}
                                      className="w-4 h-4 text-[#B99B75] rounded focus:ring-[#B99B75]"
                                    />
                                    <span className="text-sm text-[#324557]">
                                      {locale === "ar" && addOn.descriptionAr
                                        ? addOn.descriptionAr
                                        : addOn.description || addOn.type}
                                    </span>
                                    {addOn.included && (
                                      <span className="text-xs text-green-600">({t("Included")})</span>
                                    )}
                                  </div>
                                  {!addOn.included && addOn.price && (
                                    <span className="text-sm font-semibold text-[#B99B75]">
                                      +{addOn.price} {addOn.priceCurrency || room.currency}
                                    </span>
                                  )}
                                </label>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">{t("No add-ons available")}</p>
                          )}
                          {room.bookingConditions && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="text-xs text-gray-600">
                                {room.bookingConditions.cancellationPolicy && (
                                  <div className="mb-1">
                                    <strong>{t("Cancellation")}:</strong>{" "}
                                    {locale === "ar" && room.bookingConditions.cancellationPolicyAr
                                      ? room.bookingConditions.cancellationPolicyAr
                                      : room.bookingConditions.cancellationPolicy}
                                  </div>
                                )}
                                {room.bookingConditions.minimumStay && (
                                  <div>
                                    <strong>{t("Minimum stay")}:</strong> {room.bookingConditions.minimumStay}{" "}
                                    {t("nights")}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
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

                    {!selectedRoomId && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          {t("Please select a room from the left to continue")}
                        </p>
                      </div>
                    )}

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

                  {/* Price Summary */}
                  {selectedRoomId && (
                    <div className="border-t border-[#E3D6C7] pt-4 space-y-2">
                      <div className="flex justify-between text-[#324557]">
                        <span>{t("Room Price")}</span>
                        <span className="font-semibold">
                          {totalPrice} {selectedRoom?.currency || "SAR"}
                        </span>
                      </div>
                      {addOnsTotal > 0 && (
                        <div className="flex justify-between text-[#324557]">
                          <span>{t("Add-ons")}</span>
                          <span className="font-semibold">
                            +{addOnsTotal} {selectedRoom?.currency || "SAR"}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold text-[#324557] pt-2 border-t border-[#E3D6C7]">
                        <span>{t("Total")}</span>
                        <span className="text-[#B99B75]">
                          {totalPrice + addOnsTotal} {selectedRoom?.currency || "SAR"}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold text-lg py-6"
                    disabled={isSubmitting || !selectedRoomId}
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
