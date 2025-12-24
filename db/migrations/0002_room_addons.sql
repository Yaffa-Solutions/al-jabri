-- Add add-on options and booking conditions to rooms table
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "add_ons" json DEFAULT '[]'::json;
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "booking_conditions" json DEFAULT '{}'::json;

