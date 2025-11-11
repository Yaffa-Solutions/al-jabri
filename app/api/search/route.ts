import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const destination = searchParams.get("destination")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const guests = searchParams.get("guests")

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Import hotels data
  const hotelsResponse = await fetch(`${request.url.split("/api")[0]}/api/hotels`)
  const hotelsData = await hotelsResponse.json()
  let hotels = hotelsData.data || []

  // Filter by destination if provided
  if (destination && destination.trim() !== "") {
    hotels = hotels.filter(
      (hotel: any) =>
        hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.locationAr.includes(destination) ||
        hotel.name.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.nameAr.includes(destination),
    )
  }

  // Return search results with query parameters
  return NextResponse.json({
    success: true,
    data: {
      hotels,
      searchParams: {
        destination,
        checkIn,
        checkOut,
        guests: guests ? Number.parseInt(guests) : 1,
      },
    },
  })
}
