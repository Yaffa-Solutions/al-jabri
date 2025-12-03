"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function FeaturedHotels() {
  const { t, locale } = useI18n()
  const [hotels, setHotels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/hotels")
        const data = await response.json()
        if (data.success) {
          setHotels(data.data.slice(0, 4))
        }
      } catch (error) {
        console.error("[v0] Error fetching hotels:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#B99B75] mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("hotels.featured")}</h2>
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">{t("hotels.discover")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={locale === "ar" ? hotel.nameAr : hotel.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  ${hotel.price}/{t("hotels.night")}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 text-balance">
                  {locale === "ar" ? hotel.nameAr : hotel.name}
                </h3>

                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {locale === "ar" ? hotel.locationAr : hotel.location}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-[#B99B75] text-[#B99B75]" />
                    <span className="ml-1 font-semibold text-foreground">{hotel.rating}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Link href={`/booking?hotelId=${hotel.id}`} className="w-full">
                  <Button className="w-full bg-primary hover:bg-[#48647E] text-primary-foreground">
                    {t("hotels.bookNow")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/booking">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              {t("hotels.viewAll")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedHotels
