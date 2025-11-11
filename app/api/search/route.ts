import { NextResponse } from "next/server"

const hotels = [
  {
    id: "1",
    name: "Luxury Palace Hotel",
    nameAr: "فندق القصر الفاخر",
    location: "Riyadh",
    locationAr: "الرياض",
    price: 450,
    rating: 4.8,
    reviews: 342,
    image: "/luxury-hotel-riyadh.jpg",
  },
  {
    id: "2",
    name: "Grand Oasis Resort",
    nameAr: "منتجع الواحة الكبرى",
    location: "Jeddah",
    locationAr: "جدة",
    price: 380,
    rating: 4.6,
    reviews: 289,
    image: "/beachfront-resort-jeddah.jpg",
  },
  {
    id: "3",
    name: "Royal Heights Hotel",
    nameAr: "فندق المرتفعات الملكية",
    location: "Mecca",
    locationAr: "مكة المكرمة",
    price: 520,
    rating: 4.9,
    reviews: 512,
    image: "/modern-hotel-mecca.jpg",
  },
  {
    id: "4",
    name: "Desert Sands Hotel",
    nameAr: "فندق رمال الصحراء",
    location: "AlUla",
    locationAr: "العلا",
    price: 420,
    rating: 4.7,
    reviews: 198,
    image: "/desert-hotel-alula.jpg",
  },
  {
    id: "5",
    name: "City Center Business Hotel",
    nameAr: "فندق سيتي سنتر للأعمال",
    location: "Riyadh",
    locationAr: "الرياض",
    price: 320,
    rating: 4.5,
    reviews: 267,
    image: "/modern-business-hotel-riyadh.jpg",
  },
  {
    id: "6",
    name: "Seaside Paradise Resort",
    nameAr: "منتجع الجنة الساحلية",
    location: "Jeddah",
    locationAr: "جدة",
    price: 550,
    rating: 4.8,
    reviews: 423,
    image: "/luxury-beach-resort-jeddah.jpg",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const destination = searchParams.get("destination")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const guests = searchParams.get("guests")

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  let filteredHotels = [...hotels]

  // Filter by destination if provided and not empty
  if (destination && destination.trim() !== "") {
    filteredHotels = hotels.filter(
      (hotel) =>
        hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.locationAr.includes(destination) ||
        hotel.name.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.nameAr.includes(destination),
    )
  }

  const hotelsToReturn = filteredHotels.length > 0 ? filteredHotels : hotels

  // Return search results with query parameters
  return NextResponse.json({
    success: true,
    data: {
      hotels: hotelsToReturn,
      searchParams: {
        destination,
        checkIn,
        checkOut,
        guests: guests ? Number.parseInt(guests) : 1,
      },
    },
  })
}
