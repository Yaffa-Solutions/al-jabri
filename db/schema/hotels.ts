import { pgTable, varchar, timestamp, text, integer, decimal, json } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// Hotels table
export const hotels = pgTable("hotels", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  locationAr: varchar("location_ar", { length: 255 }).notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0").notNull(),
  reviews: integer("reviews").default(0).notNull(),
  mainImage: text("main_image"), // S3 URL
  images: json("images").$type<string[]>().default([]), // Array of S3 URLs
  amenities: json("amenities").$type<string[]>().default([]),
  amenitiesAr: json("amenities_ar").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// Rooms table
export const rooms = pgTable("rooms", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  hotelId: varchar("hotel_id", { length: 128 })
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 100 }).notNull(), // standard, deluxe, suite
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  available: integer("available").default(0).notNull(), // Number of available rooms
  description: text("description"),
  descriptionAr: text("description_ar"),
  images: json("images").$type<string[]>().default([]), // Array of S3 URLs
  maxGuests: integer("max_guests").default(2).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})
