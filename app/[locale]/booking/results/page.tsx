"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Loader2 } from "lucide-react"

export default function BookingResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const searchResults = sessionStorage.getItem("searchResults")
    if (searchResults) {
      setResults(JSON.parse(searchResults))
    } else {
      router.push("/booking")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#B99B75]" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!results) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#324557] mb-2">Search Results</h1>
            <p className="text-[#5F83A4]">
              Found {results.hotels.length} hotel{results.hotels.length !== 1 ? "s" : ""} for your search
            </p>
          </div>

          <div className="grid gap-6">
            {results.hotels.map((hotel: any) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-3">
                  <div className="md:col-span-1">
                    <img
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-full object-cover min-h-[200px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl text-[#324557]">{hotel.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <MapPin className="w-4 h-4" />
                            {hotel.location}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-[#B99B75] text-white px-3 py-1 rounded-lg">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-semibold">{hotel.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#5F83A4] mb-4">{hotel.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.map((amenity: string) => (
                          <span key={amenity} className="px-3 py-1 bg-[#E3D6C7] text-[#324557] rounded-full text-sm">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-3xl font-bold text-[#B99B75]">${hotel.price}</span>
                          <span className="text-[#5F83A4] ml-2">per night</span>
                        </div>
                        <Button
                          className="bg-[#B99B75] hover:bg-[#CEB89E] text-white"
                          onClick={() => router.push(`/booking/confirm?hotelId=${hotel.id}`)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
