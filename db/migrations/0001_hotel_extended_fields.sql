-- Migration: Add extended fields to hotels table
-- This migration adds facilities, policies, availability status, and other fields

-- Create availability status enum
DO $$ BEGIN
  CREATE TYPE "public"."availability_status" AS ENUM('available', 'limited', 'fully_booked', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to hotels table
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "address" text;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "address_ar" text;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "city" varchar(100);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "city_ar" varchar(100);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "country" varchar(100) DEFAULT 'Saudi Arabia';
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "country_ar" varchar(100) DEFAULT 'المملكة العربية السعودية';
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "postal_code" varchar(20);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "latitude" numeric(10, 8);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "longitude" numeric(11, 8);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "star_rating" integer NOT NULL DEFAULT 3;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "media_gallery" json DEFAULT '[]'::json;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "facilities" json DEFAULT '[]'::json;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "policies" json DEFAULT '[]'::json;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "check_in_time" varchar(10) DEFAULT '14:00';
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "check_out_time" varchar(10) DEFAULT '12:00';
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "availability_status" "availability_status" NOT NULL DEFAULT 'available';
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "phone" varchar(50);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "email" varchar(255);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "website" varchar(255);
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "published" boolean NOT NULL DEFAULT false;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "meta_description" text;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "meta_description_ar" text;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "meta_keywords" text;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "meta_keywords_ar" text;
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "slug" varchar(255);

-- Add new columns to rooms table
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "type_ar" varchar(100);
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "amenities" json DEFAULT '[]'::json;
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "amenities_ar" json DEFAULT '[]'::json;
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "size" integer;
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "bed_type" varchar(100);
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "bed_type_ar" varchar(100);

-- Update existing hotels to have default availability status
UPDATE "hotels" SET "availability_status" = 'available' WHERE "availability_status" IS NULL;
UPDATE "hotels" SET "published" = true WHERE "published" IS NULL;
UPDATE "hotels" SET "featured" = false WHERE "featured" IS NULL;
UPDATE "hotels" SET "star_rating" = 3 WHERE "star_rating" IS NULL;

