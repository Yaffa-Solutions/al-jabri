import { NextResponse } from "next/server"

// Dummy hotels data
const hotels = [
  {
    id: "1",
    name: "Luxury Palace Hotel",
    nameAr: "فندق القصر الفاخر",
    location: "Riyadh",
    locationAr: "الرياض",
    price: 450,
    rating: 4.8,
    image: "/luxury-hotel-riyadh.jpg",
    amenities: ["Pool", "Spa", "Restaurant", "Gym", "WiFi"],
    amenitiesAr: ["مسبح", "سبا", "مطعم", "صالة رياضية", "واي فاي"],
    description: "Experience ultimate luxury in the heart of Riyadh",
    descriptionAr: "استمتع بالفخامة القصوى في قلب الرياض",
    rooms: [
      { type: "standard", price: 450, available: 5 },
      { type: "deluxe", price: 650, available: 3 },
      { type: "suite", price: 950, available: 2 },
    ],
  },
  {
    id: "2",
    name: "Grand Oasis Resort",
    nameAr: "منتجع الواحة الكبرى",
    location: "Jeddah",
    locationAr: "جدة",
    price: 380,
    rating: 4.6,
    image: "/beachfront-resort-jeddah.jpg",
    amenities: ["Beach", "Pool", "Restaurant", "WiFi"],
    amenitiesAr: ["شاطئ", "مسبح", "مطعم", "واي فاي"],
    description: "Beachfront paradise with stunning Red Sea views",
    descriptionAr: "جنة على الشاطئ مع إطلالات خلابة على البحر الأحمر",
    rooms: [
      { type: "standard", price: 380, available: 8 },
      { type: "deluxe", price: 550, available: 4 },
      { type: "suite", price: 850, available: 2 },
    ],
  },
  {
    id: "3",
    name: "Royal Heights Hotel",
    nameAr: "فندق المرتفعات الملكية",
    location: "Mecca",
    locationAr: "مكة المكرمة",
    price: 520,
    rating: 4.9,
    image: "/modern-hotel-mecca.jpg",
    amenities: ["Restaurant", "Room Service", "WiFi", "Parking"],
    amenitiesAr: ["مطعم", "خدمة الغرف", "واي فاي", "موقف سيارات"],
    description: "Premium accommodation near the Holy Mosque",
    descriptionAr: "إقامة فاخرة بالقرب من الحرم المكي",
    rooms: [
      { type: "standard", price: 520, available: 10 },
      { type: "deluxe", price: 720, available: 6 },
      { type: "suite", price: 1050, available: 3 },
    ],
  },
  {
    id: "4",
    name: "Desert Sands Hotel",
    nameAr: "فندق رمال الصحراء",
    location: "AlUla",
    locationAr: "العلا",
    price: 420,
    rating: 4.7,
    image: "/desert-hotel-alula.jpg",
    amenities: ["Pool", "Restaurant", "Tours", "WiFi"],
    amenitiesAr: ["مسبح", "مطعم", "جولات", "واي فاي"],
    description: "Unique desert experience with heritage tours",
    descriptionAr: "تجربة صحراوية فريدة مع جولات تراثية",
    rooms: [
      { type: "standard", price: 420, available: 7 },
      { type: "deluxe", price: 600, available: 4 },
      { type: "suite", price: 900, available: 2 },
    ],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const location = searchParams.get("location")

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get specific hotel by ID
  if (id) {
    const hotel = hotels.find((h) => h.id === id)
    if (hotel) {
      return NextResponse.json({ success: true, data: hotel })
    }
    return NextResponse.json({ success: false, error: "Hotel not found" }, { status: 404 })
  }

  // Filter by location if provided
  let filteredHotels = hotels
  if (location) {
    filteredHotels = hotels.filter(
      (h) => h.location.toLowerCase().includes(location.toLowerCase()) || h.locationAr.includes(location),
    )
  }

  return NextResponse.json({ success: true, data: filteredHotels })
}
