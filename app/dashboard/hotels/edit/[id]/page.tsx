import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { hotels } from "@/db/schema"
import { eq } from "drizzle-orm"
import HotelForm from "../../hotel-form"
import type { HotelFacility, HotelPolicy, MediaItem, AvailabilityStatus } from "@/types/hotel"

export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  const { id } = await params

  // Fetch the hotel
  const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id))

  if (!hotel) {
    redirect("/dashboard/hotels")
  }

  return (
    <div className="p-6">
      <HotelForm
        initialData={{
          id: hotel.id,
          name: hotel.name,
          nameAr: hotel.nameAr,
          location: hotel.location,
          locationAr: hotel.locationAr,
          description: hotel.description,
          descriptionAr: hotel.descriptionAr,
          address: hotel.address,
          addressAr: hotel.addressAr,
          city: hotel.city,
          cityAr: hotel.cityAr,
          country: hotel.country,
          countryAr: hotel.countryAr,
          postalCode: hotel.postalCode,
          latitude: hotel.latitude ? Number(hotel.latitude) : null,
          longitude: hotel.longitude ? Number(hotel.longitude) : null,
          starRating: hotel.starRating,
          mainImage: hotel.mainImage,
          images: (hotel.images || []) as string[],
          mediaGallery: (hotel.mediaGallery || []) as MediaItem[],
          amenities: (hotel.amenities || []) as string[],
          amenitiesAr: (hotel.amenitiesAr || []) as string[],
          facilities: (hotel.facilities || []) as HotelFacility[],
          policies: (hotel.policies || []) as HotelPolicy[],
          checkInTime: hotel.checkInTime || '14:00',
          checkOutTime: hotel.checkOutTime || '12:00',
          availabilityStatus: hotel.availabilityStatus as AvailabilityStatus,
          phone: hotel.phone,
          email: hotel.email,
          website: hotel.website,
          published: hotel.published,
          featured: hotel.featured,
          metaDescription: hotel.metaDescription,
          metaDescriptionAr: hotel.metaDescriptionAr,
          metaKeywords: hotel.metaKeywords,
          metaKeywordsAr: hotel.metaKeywordsAr,
          slug: hotel.slug,
        }}
      />
    </div>
  )
}

