"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Wifi, Coffee, Dumbbell, ArrowLeft } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function SearchResults() {
  const { locale } = useI18n()
  const [searchData, setSearchData] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("searchResults")
    if (data) {
      setSearchData(JSON.parse(data))
    }
  }, [])

  if (!searchData) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#324557] mb-4">No search results found</h2>
          <Link href="/booking">
            <Button className="bg-[#B99B75] hover:bg-[#CEB89E] text-white">Start New Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { hotels, searchParams } = searchData

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7] min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/booking">
            <Button variant="ghost" className="text-[#324557] hover:text-[#B99B75] gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <h1 className="text-3xl font-bold text-[#324557] mb-4">Search Results</h1>
          <div className="flex flex-wrap gap-4 text-sm text-[#5F83A4]">
            <div>
              <span className="font-semibold">Location:</span> {searchParams.destination}
            </div>
            <div>
              <span className="font-semibold">Check-in:</span> {searchParams.checkIn}
            </div>
            <div>
              <span className="font-semibold">Check-out:</span> {searchParams.checkOut}
            </div>
            <div>
              <span className="font-semibold">Guests:</span> {searchParams.guests}
            </div>
          </div>
          <p className="mt-4 text-[#324557] font-semibold">Found {hotels.length} available hotels</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: any) => (
            <Card
              key={hotel.id}
              className="bg-white border-[#E3D6C7] hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={locale === "ar" ? hotel.nameAr : hotel.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-[#B99B75] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${hotel.price}/night
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#324557] mb-2">{locale === "ar" ? hotel.nameAr : hotel.name}</h3>

                <div className="flex items-center text-sm text-[#5F83A4] mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {locale === "ar" ? hotel.locationAr : hotel.location}
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-[#B99B75] text-[#B99B75]" />
                  <span className="font-semibold text-[#324557]">{hotel.rating}</span>
                  <span className="text-sm text-[#5F83A4]">({hotel.reviews} reviews)</span>
                </div>

                <div className="flex gap-3 text-[#5F83A4]">
                  <Wifi className="w-5 h-5" />
                  <Coffee className="w-5 h-5" />
                  <Dumbbell className="w-5 h-5" />
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Link href={`/booking?hotelId=${hotel.id}`} className="w-full">
                  <Button className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SearchResults
