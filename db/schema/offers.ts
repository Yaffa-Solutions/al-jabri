import { pgTable, varchar, timestamp, text, integer, decimal, boolean, json, pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { rooms } from "./hotels"
import { hotels } from "./hotels"

// Discount type enum
export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed"])

// Offers table
export const offers = pgTable("offers", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),

  // Can apply to either a room or entire hotel
  roomId: varchar("room_id", { length: 128 }).references(() => rooms.id, { onDelete: "cascade" }),
  hotelId: varchar("hotel_id", { length: 128 }).references(() => hotels.id, { onDelete: "cascade" }),

  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(), // % or fixed amount

  validFrom: timestamp("valid_from", { mode: "date" }).notNull(),
  validTo: timestamp("valid_to", { mode: "date" }).notNull(),

  active: boolean("active").default(true).notNull(),

  // Optional banner image for promotional offers
  bannerImage: text("banner_image"), // S3 URL

  // Conditions (JSON for flexibility)
  conditions: json("conditions").$type<{
    minNights?: number
    maxGuests?: number
    bookingDates?: { start: string; end: string }
  }>(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})
