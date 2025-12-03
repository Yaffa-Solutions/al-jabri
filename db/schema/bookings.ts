import { pgTable, varchar, timestamp, integer, decimal, pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./users"
import { hotels, rooms } from "./hotels"
import { offers } from "./offers"

// Booking status enum
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled", "completed"])

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  // Foreign keys
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  hotelId: varchar("hotel_id", { length: 128 })
    .notNull()
    .references(() => hotels.id, { onDelete: "restrict" }),
  roomId: varchar("room_id", { length: 128 })
    .notNull()
    .references(() => rooms.id, { onDelete: "restrict" }),
  offerId: varchar("offer_id", { length: 128 }).references(() => offers.id, { onDelete: "set null" }),

  // Booking details
  checkIn: timestamp("check_in", { mode: "date" }).notNull(),
  checkOut: timestamp("check_out", { mode: "date" }).notNull(),
  guests: integer("guests").notNull(),

  // Guest information (copied at time of booking)
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),

  // Pricing
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  discountApplied: decimal("discount_applied", { precision: 10, scale: 2 }).default("0.00"),

  // Status and confirmation
  status: bookingStatusEnum("status").default("pending").notNull(),
  confirmationNumber: varchar("confirmation_number", { length: 50 }).notNull().unique(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})
