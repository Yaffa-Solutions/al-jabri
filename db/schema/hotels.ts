import { pgTable, varchar, timestamp, text, integer, decimal, json, boolean, pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// Availability status enum
export const availabilityStatusEnum = pgEnum("availability_status", ["available", "limited", "fully_booked", "closed"])

// Facility types for structured data
export type HotelFacility = {
  id: string
  type: 'restaurant' | 'bar' | 'pool' | 'gym' | 'parking' | 'wifi' | 'reception' | 'airport_transfer' | 'accessibility' | 'cleaning' | 'spa' | 'business_center' | 'room_service' | 'laundry' | 'concierge'
  available: boolean
  description?: string
  descriptionAr?: string
}

// Hotel policy structure
export type HotelPolicy = {
  id: string
  type: 'check_in' | 'check_out' | 'cancellation' | 'pets' | 'smoking' | 'payment' | 'children' | 'extra_beds' | 'age_restriction' | 'dress_code' | 'other'
  title: string
  titleAr: string
  description: string
  descriptionAr: string
}

// Media item structure (for gallery)
export type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  order: number
}

// Hotels table with extended fields
export const hotels = pgTable("hotels", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Basic info - English
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  description: text("description").notNull(),
  
  // Basic info - Arabic
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  locationAr: varchar("location_ar", { length: 255 }).notNull(),
  descriptionAr: text("description_ar").notNull(),
  
  // Address details
  address: text("address"),
  addressAr: text("address_ar"),
  city: varchar("city", { length: 100 }),
  cityAr: varchar("city_ar", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Saudi Arabia"),
  countryAr: varchar("country_ar", { length: 100 }).default("المملكة العربية السعودية"),
  postalCode: varchar("postal_code", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Ratings & Reviews
  starRating: integer("star_rating").default(3).notNull(), // 1-5 stars
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0").notNull(), // Guest rating
  reviews: integer("reviews").default(0).notNull(),
  
  // Images
  mainImage: text("main_image"), // S3 URL
  images: json("images").$type<string[]>().default([]), // Legacy array of S3 URLs
  
  // Media gallery (new - supports images and videos)
  mediaGallery: json("media_gallery").$type<MediaItem[]>().default([]),
  
  // Amenities (legacy - simple string arrays)
  amenities: json("amenities").$type<string[]>().default([]),
  amenitiesAr: json("amenities_ar").$type<string[]>().default([]),
  
  // Facilities (new - structured with availability)
  facilities: json("facilities").$type<HotelFacility[]>().default([]),
  
  // Policies
  policies: json("policies").$type<HotelPolicy[]>().default([]),
  
  // Check-in/out times
  checkInTime: varchar("check_in_time", { length: 10 }).default("14:00"),
  checkOutTime: varchar("check_out_time", { length: 10 }).default("12:00"),
  
  // Availability
  availabilityStatus: availabilityStatusEnum("availability_status").default("available").notNull(),
  
  // Contact info
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  
  // Status
  published: boolean("published").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  
  // SEO
  metaDescription: text("meta_description"),
  metaDescriptionAr: text("meta_description_ar"),
  metaKeywords: text("meta_keywords"),
  metaKeywordsAr: text("meta_keywords_ar"),
  slug: varchar("slug", { length: 255 }),
  
  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// Room add-on options structure
export type RoomAddOn = {
  id: string
  type: 'breakfast' | 'daily_cleaning' | 'room_service' | 'laundry' | 'airport_transfer' | 'spa_access' | 'gym_access' | 'late_checkout' | 'early_checkin' | 'extra_bed' | 'mini_bar' | 'wifi_premium'
  included: boolean // Whether included in base price
  price?: number // Additional price if not included
  priceCurrency?: string
  description?: string
  descriptionAr?: string
}

// Rooms table
export const rooms = pgTable("rooms", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  hotelId: varchar("hotel_id", { length: 128 })
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 100 }).notNull(), // standard, deluxe, suite
  typeAr: varchar("type_ar", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  available: integer("available").default(0).notNull(), // Number of available rooms
  description: text("description"),
  descriptionAr: text("description_ar"),
  images: json("images").$type<string[]>().default([]), // Array of S3 URLs
  maxGuests: integer("max_guests").default(2).notNull(),
  amenities: json("amenities").$type<string[]>().default([]),
  amenitiesAr: json("amenities_ar").$type<string[]>().default([]),
  size: integer("size"), // Room size in sqm
  bedType: varchar("bed_type", { length: 100 }),
  bedTypeAr: varchar("bed_type_ar", { length: 100 }),
  // Add-on options (breakfast, daily cleaning, etc.)
  addOns: json("add_ons").$type<RoomAddOn[]>().default([]),
  // Booking conditions (cancellation policy, minimum stay, etc.)
  bookingConditions: json("booking_conditions").$type<{
    cancellationPolicy?: string
    cancellationPolicyAr?: string
    minimumStay?: number
    maximumStay?: number
    checkInTime?: string
    checkOutTime?: string
    ageRestriction?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
  }>().default({}),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// Export types
export type Hotel = typeof hotels.$inferSelect
export type NewHotel = typeof hotels.$inferInsert
export type Room = typeof rooms.$inferSelect
export type NewRoom = typeof rooms.$inferInsert
