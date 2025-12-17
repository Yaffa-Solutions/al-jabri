import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { hotels, rooms } from "@/db/schema"
import { eq, ilike, or, desc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { logActivity } from "@/lib/activity-logger"

// GET - Fetch hotels (public for listing, detailed for single)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const location = searchParams.get("location")
    const published = searchParams.get("published")
    const featured = searchParams.get("featured")

    // Get specific hotel by ID with its rooms
    if (id) {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1)

      if (!hotel) {
        return NextResponse.json({ success: false, error: "Hotel not found" }, { status: 404 })
      }

      // Get rooms for this hotel
      const hotelRooms = await db.select().from(rooms).where(eq(rooms.hotelId, id))

      // Format response with all fields
      const formattedHotel = {
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
        rating: Number(hotel.rating),
        reviews: hotel.reviews,
        mainImage: hotel.mainImage,
        images: hotel.images as string[],
        mediaGallery: hotel.mediaGallery || [],
        amenities: hotel.amenities as string[],
        amenitiesAr: hotel.amenitiesAr as string[],
        facilities: hotel.facilities || [],
        policies: hotel.policies || [],
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        availabilityStatus: hotel.availabilityStatus,
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
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
        price: hotelRooms.length > 0 ? Math.min(...hotelRooms.map(r => Number(r.price))) : 0,
        rooms: hotelRooms.map((room) => ({
          id: room.id,
          type: room.type,
          typeAr: room.typeAr,
          price: Number(room.price),
          currency: room.currency,
          available: room.available,
          description: room.description,
          descriptionAr: room.descriptionAr,
          images: room.images as string[],
          maxGuests: room.maxGuests,
          amenities: room.amenities as string[],
          amenitiesAr: room.amenitiesAr as string[],
          size: room.size,
          bedType: room.bedType,
          bedTypeAr: room.bedTypeAr,
        })),
      }

      return NextResponse.json({ success: true, data: formattedHotel })
    }

    // Fetch hotels with optional location filter
    let allHotels
    
    if (location) {
      allHotels = await db
        .select()
        .from(hotels)
        .where(or(ilike(hotels.location, `%${location}%`), ilike(hotels.locationAr, `%${location}%`)))
        .orderBy(desc(hotels.createdAt))
    } else {
      allHotels = await db.select().from(hotels).orderBy(desc(hotels.createdAt))
    }

    // Apply additional filters
    let filteredHotels = allHotels

    if (published === "true") {
      filteredHotels = filteredHotels.filter(h => h.published)
    } else if (published === "false") {
      filteredHotels = filteredHotels.filter(h => !h.published)
    }

    if (featured === "true") {
      filteredHotels = filteredHotels.filter(h => h.featured)
    }

    // Get rooms for each hotel
    const hotelsWithData = await Promise.all(
      filteredHotels.map(async (hotel) => {
        const hotelRooms = await db.select().from(rooms).where(eq(rooms.hotelId, hotel.id))
        const lowestPrice = hotelRooms.length > 0 ? Math.min(...hotelRooms.map((r) => Number(r.price))) : 0

        return {
          id: hotel.id,
          name: hotel.name,
          nameAr: hotel.nameAr,
          location: hotel.location,
          locationAr: hotel.locationAr,
          description: hotel.description,
          descriptionAr: hotel.descriptionAr,
          starRating: hotel.starRating,
          rating: Number(hotel.rating),
          reviews: hotel.reviews,
          mainImage: hotel.mainImage,
          images: hotel.images as string[],
          amenities: hotel.amenities as string[],
          amenitiesAr: hotel.amenitiesAr as string[],
          facilities: hotel.facilities || [],
          availabilityStatus: hotel.availabilityStatus,
          published: hotel.published,
          featured: hotel.featured,
          createdAt: hotel.createdAt,
          updatedAt: hotel.updatedAt,
          price: lowestPrice,
          roomCount: hotelRooms.length,
          rooms: hotelRooms.map((room) => ({
            type: room.type,
            price: Number(room.price),
            available: room.available,
          })),
        }
      }),
    )

    return NextResponse.json({ success: true, data: hotelsWithData })
  } catch (error) {
    console.error("[v0] Error fetching hotels:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch hotels" }, { status: 500 })
  }
}

// POST - Create new hotel
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      nameAr,
      location,
      locationAr,
      description,
      descriptionAr,
      address,
      addressAr,
      city,
      cityAr,
      country,
      countryAr,
      postalCode,
      latitude,
      longitude,
      starRating,
      mainImage,
      images,
      mediaGallery,
      amenities,
      amenitiesAr,
      facilities,
      policies,
      checkInTime,
      checkOutTime,
      availabilityStatus,
      phone,
      email,
      website,
      published,
      featured,
      metaDescription,
      metaDescriptionAr,
      metaKeywords,
      metaKeywordsAr,
      slug,
    } = body

    // Validate required fields
    if (!name || !nameAr || !location || !locationAr || !description || !descriptionAr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [newHotel] = await db
      .insert(hotels)
      .values({
        name,
        nameAr,
        location,
        locationAr,
        description,
        descriptionAr,
        address: address || null,
        addressAr: addressAr || null,
        city: city || null,
        cityAr: cityAr || null,
        country: country || "Saudi Arabia",
        countryAr: countryAr || "المملكة العربية السعودية",
        postalCode: postalCode || null,
        latitude: latitude || null,
        longitude: longitude || null,
        starRating: starRating || 3,
        mainImage: mainImage || null,
        images: images || [],
        mediaGallery: mediaGallery || [],
        amenities: amenities || [],
        amenitiesAr: amenitiesAr || [],
        facilities: facilities || [],
        policies: policies || [],
        checkInTime: checkInTime || "14:00",
        checkOutTime: checkOutTime || "12:00",
        availabilityStatus: availabilityStatus || "available",
        phone: phone || null,
        email: email || null,
        website: website || null,
        published: published || false,
        featured: featured || false,
        metaDescription: metaDescription || null,
        metaDescriptionAr: metaDescriptionAr || null,
        metaKeywords: metaKeywords || null,
        metaKeywordsAr: metaKeywordsAr || null,
        slug: slug || null,
      })
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "hotel_created",
      details: { hotelId: newHotel.id, name },
      request,
    })

    return NextResponse.json({ success: true, data: newHotel })
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 })
  }
}

// PUT - Update hotel
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      name,
      nameAr,
      location,
      locationAr,
      description,
      descriptionAr,
      address,
      addressAr,
      city,
      cityAr,
      country,
      countryAr,
      postalCode,
      latitude,
      longitude,
      starRating,
      mainImage,
      images,
      mediaGallery,
      amenities,
      amenitiesAr,
      facilities,
      policies,
      checkInTime,
      checkOutTime,
      availabilityStatus,
      phone,
      email,
      website,
      published,
      featured,
      metaDescription,
      metaDescriptionAr,
      metaKeywords,
      metaKeywordsAr,
      slug,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 })
    }

    // Validate required fields
    if (!name || !nameAr || !location || !locationAr || !description || !descriptionAr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if hotel exists
    const [existingHotel] = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1)

    if (!existingHotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    const [updatedHotel] = await db
      .update(hotels)
      .set({
        name,
        nameAr,
        location,
        locationAr,
        description,
        descriptionAr,
        address: address || null,
        addressAr: addressAr || null,
        city: city || null,
        cityAr: cityAr || null,
        country: country || "Saudi Arabia",
        countryAr: countryAr || "المملكة العربية السعودية",
        postalCode: postalCode || null,
        latitude: latitude || null,
        longitude: longitude || null,
        starRating: starRating || 3,
        mainImage: mainImage || null,
        images: images || [],
        mediaGallery: mediaGallery || [],
        amenities: amenities || [],
        amenitiesAr: amenitiesAr || [],
        facilities: facilities || [],
        policies: policies || [],
        checkInTime: checkInTime || "14:00",
        checkOutTime: checkOutTime || "12:00",
        availabilityStatus: availabilityStatus || "available",
        phone: phone || null,
        email: email || null,
        website: website || null,
        published: published ?? false,
        featured: featured ?? false,
        metaDescription: metaDescription || null,
        metaDescriptionAr: metaDescriptionAr || null,
        metaKeywords: metaKeywords || null,
        metaKeywordsAr: metaKeywordsAr || null,
        slug: slug || null,
        updatedAt: new Date(),
      })
      .where(eq(hotels.id, id))
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "hotel_updated",
      details: { hotelId: id, name },
      request,
    })

    return NextResponse.json({ success: true, data: updatedHotel })
  } catch (error) {
    console.error("Error updating hotel:", error)
    return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 })
  }
}

// PATCH - Partial update (publish/unpublish, featured toggle)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, published, featured, availabilityStatus } = body

    if (!id) {
      return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 })
    }

    // Check if hotel exists
    const [existingHotel] = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1)

    if (!existingHotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    
    if (typeof published === "boolean") {
      updateData.published = published
    }
    if (typeof featured === "boolean") {
      updateData.featured = featured
    }
    if (availabilityStatus) {
      updateData.availabilityStatus = availabilityStatus
    }

    const [updatedHotel] = await db
      .update(hotels)
      .set(updateData)
      .where(eq(hotels.id, id))
      .returning()

    // Log activity
    let action = "hotel_updated"
    if (typeof published === "boolean") {
      action = published ? "hotel_published" : "hotel_unpublished"
    }

    await logActivity({
      userId: session.user.id,
      action,
      details: { hotelId: id, name: existingHotel.name },
      request,
    })

    return NextResponse.json({ success: true, data: updatedHotel })
  } catch (error) {
    console.error("Error patching hotel:", error)
    return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 })
  }
}

// DELETE - Delete hotel
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 })
    }

    // Check if hotel exists
    const [existingHotel] = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1)

    if (!existingHotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    // Delete hotel (rooms will be cascade deleted due to foreign key)
    await db.delete(hotels).where(eq(hotels.id, id))

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "hotel_deleted",
      details: { hotelId: id, name: existingHotel.name },
      request,
    })

    return NextResponse.json({ success: true, message: "Hotel deleted successfully" })
  } catch (error) {
    console.error("Error deleting hotel:", error)
    return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 })
  }
}
