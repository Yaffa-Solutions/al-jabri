import { pgTable, varchar, timestamp, text, json } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./users"

// User activities table (for tracking user actions)
export const userActivities = pgTable("user_activities", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  action: varchar("action", { length: 100 }).notNull(), // login, logout, booking_created, profile_updated, etc.

  details: json("details").$type<Record<string, any>>(), // Additional context about the action

  ipAddress: varchar("ip_address", { length: 45 }), // IPv4 or IPv6
  userAgent: text("user_agent"), // Browser/device info

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})
