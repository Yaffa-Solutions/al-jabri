"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!location || !checkIn || !checkOut) {
      toast.error("Missing information", {
        description: "Please fill in location and dates",
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
      })

      const response = await fetch(`/api/search?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        // Store search results
        sessionStorage.setItem("searchResults", JSON.stringify(data.data))

        toast.success("Search complete!", {
          description: `Found ${data.data.hotels.length} hotel(s)`,
        })

        // Navigate to results
        setTimeout(() => {
          router.push("/booking/results")
        }, 500)
      } else {
        toast.error("Search failed", {
          description: data.error || "Please try again",
        })
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
      toast.error("Connection error", {
        description: "Please check your internet connection",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
      <Card className="p-6 bg-card shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-2 text-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Where to?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-2 text-foreground">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-2 text-foreground">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-2 text-foreground">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="2"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="flex items-end lg:col-span-1">
            <Button
              onClick={handleSearch}
              className="w-full bg-primary hover:bg-[#48647E] text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SearchBar
