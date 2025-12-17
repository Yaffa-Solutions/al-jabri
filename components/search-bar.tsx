"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, Loader2, BedDouble } from "lucide-react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n-context"

export function SearchBar() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")
  const [rooms, setRooms] = useState("1")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!location || !checkIn || !checkOut) {
      toast.error(locale === 'ar' ? "معلومات ناقصة" : "Missing information", {
        description: locale === 'ar' ? "يرجى ملء الموقع والتواريخ" : "Please fill in location and dates",
      })
      return
    }

    setIsLoading(true)

    try {
      const queryParams = new URLSearchParams({
        destination: location,
        checkIn,
        checkOut,
        guests: guests || "1",
        rooms: rooms || "1",
      })

      const response = await fetch(`/api/search?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem("searchResults", JSON.stringify(data.data))

        toast.success(locale === 'ar' ? "تم البحث بنجاح!" : "Search complete!", {
          description: locale === 'ar' 
            ? `تم العثور على ${data.data.hotels.length} فندق(ات)`
            : `Found ${data.data.hotels.length} hotel(s)`,
        })

        setTimeout(() => {
          router.push("/booking/results")
        }, 500)
      } else {
        toast.error(locale === 'ar' ? "فشل البحث" : "Search failed", {
          description: data.error || (locale === 'ar' ? "يرجى المحاولة مرة أخرى" : "Please try again"),
        })
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
      toast.error(locale === 'ar' ? "خطأ في الاتصال" : "Connection error", {
        description: locale === 'ar' 
          ? "يرجى التحقق من اتصالك بالإنترنت"
          : "Please check your internet connection",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-30 -mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-navy px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-gold" />
              {locale === 'ar' ? 'ابحث عن فندقك المثالي' : 'Find Your Perfect Hotel'}
            </h3>
          </div>

          {/* Search Fields */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Location */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-navy mb-2">
                  {locale === 'ar' ? 'الوجهة' : 'Destination'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                  <Input
                    placeholder={locale === 'ar' ? 'إلى أين تريد الذهاب؟' : 'Where do you want to go?'}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="ps-10 h-12 border-gray-200 focus:border-gold focus:ring-gold/20 rounded-md"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-navy mb-2">
                  {locale === 'ar' ? 'تسجيل الوصول' : 'Check-in'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="ps-10 h-12 border-gray-200 focus:border-gold focus:ring-gold/20 rounded-md"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-navy mb-2">
                  {locale === 'ar' ? 'تسجيل المغادرة' : 'Check-out'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="ps-10 h-12 border-gray-200 focus:border-gold focus:ring-gold/20 rounded-md"
                  />
                </div>
              </div>

              {/* Guests & Rooms */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-navy mb-2">
                  {locale === 'ar' ? 'الضيوف / الغرف' : 'Guests / Rooms'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Users className="absolute left-2 rtl:left-auto rtl:right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <Input
                      type="number"
                      placeholder="2"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="ps-8 h-12 border-gray-200 focus:border-gold focus:ring-gold/20 rounded-md"
                    />
                  </div>
                  <div className="relative flex-1">
                    <BedDouble className="absolute left-2 rtl:left-auto rtl:right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <Input
                      type="number"
                      placeholder="1"
                      min="1"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="ps-8 h-12 border-gray-200 focus:border-gold focus:ring-gold/20 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1 flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 bg-gold hover:bg-gold-light text-navy font-semibold rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 me-2 animate-spin" />
                      {locale === 'ar' ? 'جاري البحث...' : 'Searching...'}
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 me-2" />
                      {locale === 'ar' ? 'بحث' : 'Search'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="bg-cream px-6 py-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-navy/70">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {locale === 'ar' ? 'أفضل سعر مضمون' : 'Best Price Guaranteed'}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                {locale === 'ar' ? 'إلغاء مجاني' : 'Free Cancellation'}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {locale === 'ar' ? 'دعم على مدار الساعة' : '24/7 Support'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
