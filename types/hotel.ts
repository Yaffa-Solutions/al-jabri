// Hotel facility types
export type FacilityType = 
  | 'restaurant'
  | 'bar'
  | 'pool'
  | 'gym'
  | 'parking'
  | 'wifi'
  | 'reception'
  | 'airport_transfer'
  | 'accessibility'
  | 'cleaning'
  | 'spa'
  | 'business_center'
  | 'room_service'
  | 'laundry'
  | 'concierge'

export type HotelFacility = {
  id: string
  type: FacilityType
  available: boolean
  description?: string
  descriptionAr?: string
}

// Hotel policy types
export type PolicyType = 
  | 'check_in'
  | 'check_out'
  | 'cancellation'
  | 'pets'
  | 'smoking'
  | 'payment'
  | 'children'
  | 'extra_beds'
  | 'age_restriction'
  | 'dress_code'
  | 'other'

export type HotelPolicy = {
  id: string
  type: PolicyType
  title: string
  titleAr: string
  description: string
  descriptionAr: string
}

// Media item for gallery
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

// Availability status
export type AvailabilityStatus = 'available' | 'limited' | 'fully_booked' | 'closed'

// Hotel form data
export type HotelFormData = {
  // Basic info
  name: string
  nameAr: string
  location: string
  locationAr: string
  description: string
  descriptionAr: string
  
  // Address
  address?: string
  addressAr?: string
  city?: string
  cityAr?: string
  country?: string
  countryAr?: string
  postalCode?: string
  latitude?: string
  longitude?: string
  
  // Ratings
  starRating: number
  
  // Images & Media
  mainImage: string | null
  images: string[]
  mediaGallery: MediaItem[]
  
  // Amenities (legacy)
  amenities: string[]
  amenitiesAr: string[]
  
  // Facilities
  facilities: HotelFacility[]
  
  // Policies
  policies: HotelPolicy[]
  
  // Check-in/out
  checkInTime: string
  checkOutTime: string
  
  // Availability
  availabilityStatus: AvailabilityStatus
  
  // Contact
  phone?: string
  email?: string
  website?: string
  
  // Status
  published: boolean
  featured: boolean
  
  // SEO
  metaDescription?: string
  metaDescriptionAr?: string
  metaKeywords?: string
  metaKeywordsAr?: string
  slug?: string
}

// Hotel display data (for frontend)
export type Hotel = {
  id: string
  name: string
  nameAr: string
  location: string
  locationAr: string
  description: string
  descriptionAr: string
  address?: string
  addressAr?: string
  city?: string
  cityAr?: string
  country?: string
  countryAr?: string
  postalCode?: string
  latitude?: string
  longitude?: string
  starRating: number
  rating: number
  reviews: number
  mainImage: string | null
  images: string[]
  mediaGallery: MediaItem[]
  amenities: string[]
  amenitiesAr: string[]
  facilities: HotelFacility[]
  policies: HotelPolicy[]
  checkInTime: string
  checkOutTime: string
  availabilityStatus: AvailabilityStatus
  phone?: string
  email?: string
  website?: string
  published: boolean
  featured: boolean
  metaDescription?: string
  metaDescriptionAr?: string
  metaKeywords?: string
  metaKeywordsAr?: string
  slug?: string
  createdAt: Date | string
  updatedAt: Date | string
  roomCount?: number
}

// Room add-on options
export type RoomAddOn = {
  id: string
  type: 'breakfast' | 'daily_cleaning' | 'room_service' | 'laundry' | 'airport_transfer' | 'spa_access' | 'gym_access' | 'late_checkout' | 'early_checkin' | 'extra_bed' | 'mini_bar' | 'wifi_premium'
  included: boolean // Whether included in base price
  price?: number // Additional price if not included
  priceCurrency?: string
  description?: string
  descriptionAr?: string
}

// Room booking conditions
export type RoomBookingConditions = {
  cancellationPolicy?: string
  cancellationPolicyAr?: string
  minimumStay?: number
  maximumStay?: number
  checkInTime?: string
  checkOutTime?: string
  ageRestriction?: number
  smokingAllowed?: boolean
  petsAllowed?: boolean
}

// Room type
export type Room = {
  id: string
  hotelId: string
  type: string
  typeAr?: string
  price: number
  currency: string
  available: number
  description?: string
  descriptionAr?: string
  images: string[]
  maxGuests: number
  amenities: string[]
  amenitiesAr: string[]
  size?: number
  bedType?: string
  bedTypeAr?: string
  addOns?: RoomAddOn[]
  bookingConditions?: RoomBookingConditions
}

// Facility labels for UI
export const facilityLabels: Record<FacilityType, { en: string; ar: string; icon: string }> = {
  restaurant: { en: 'Restaurant', ar: 'مطعم', icon: 'UtensilsCrossed' },
  bar: { en: 'Bar', ar: 'بار', icon: 'Wine' },
  pool: { en: 'Swimming Pool', ar: 'مسبح', icon: 'Waves' },
  gym: { en: 'Fitness Center', ar: 'صالة رياضية', icon: 'Dumbbell' },
  parking: { en: 'Parking', ar: 'موقف سيارات', icon: 'Car' },
  wifi: { en: 'Free WiFi', ar: 'واي فاي مجاني', icon: 'Wifi' },
  reception: { en: '24/7 Reception', ar: 'استقبال 24 ساعة', icon: 'Clock' },
  airport_transfer: { en: 'Airport Transfer', ar: 'نقل من/إلى المطار', icon: 'Plane' },
  accessibility: { en: 'Accessibility', ar: 'خدمات ذوي الاحتياجات', icon: 'Accessibility' },
  cleaning: { en: 'Cleaning Services', ar: 'خدمات التنظيف', icon: 'Sparkles' },
  spa: { en: 'Spa & Wellness', ar: 'سبا وعافية', icon: 'Flower2' },
  business_center: { en: 'Business Center', ar: 'مركز أعمال', icon: 'Briefcase' },
  room_service: { en: 'Room Service', ar: 'خدمة الغرف', icon: 'ConciergeBell' },
  laundry: { en: 'Laundry', ar: 'غسيل ملابس', icon: 'Shirt' },
  concierge: { en: 'Concierge', ar: 'خدمة الكونسيرج', icon: 'UserRound' },
}

// Policy labels for UI
export const policyLabels: Record<PolicyType, { en: string; ar: string }> = {
  check_in: { en: 'Check-in Policy', ar: 'سياسة تسجيل الوصول' },
  check_out: { en: 'Check-out Policy', ar: 'سياسة تسجيل المغادرة' },
  cancellation: { en: 'Cancellation Policy', ar: 'سياسة الإلغاء' },
  pets: { en: 'Pet Policy', ar: 'سياسة الحيوانات الأليفة' },
  smoking: { en: 'Smoking Policy', ar: 'سياسة التدخين' },
  payment: { en: 'Payment Policy', ar: 'سياسة الدفع' },
  children: { en: 'Children Policy', ar: 'سياسة الأطفال' },
  extra_beds: { en: 'Extra Bed Policy', ar: 'سياسة الأسرة الإضافية' },
  age_restriction: { en: 'Age Restriction', ar: 'قيود العمر' },
  dress_code: { en: 'Dress Code', ar: 'قواعد اللباس' },
  other: { en: 'Other Policies', ar: 'سياسات أخرى' },
}

// Availability status labels
export const availabilityLabels: Record<AvailabilityStatus, { en: string; ar: string; color: string }> = {
  available: { en: 'Available', ar: 'متاح', color: 'green' },
  limited: { en: 'Limited Availability', ar: 'توفر محدود', color: 'yellow' },
  fully_booked: { en: 'Fully Booked', ar: 'محجوز بالكامل', color: 'red' },
  closed: { en: 'Temporarily Closed', ar: 'مغلق مؤقتاً', color: 'gray' },
}

// Default facilities template
export const defaultFacilities: HotelFacility[] = [
  { id: 'f1', type: 'restaurant', available: false },
  { id: 'f2', type: 'bar', available: false },
  { id: 'f3', type: 'pool', available: false },
  { id: 'f4', type: 'gym', available: false },
  { id: 'f5', type: 'parking', available: false },
  { id: 'f6', type: 'wifi', available: false },
  { id: 'f7', type: 'reception', available: false },
  { id: 'f8', type: 'airport_transfer', available: false },
  { id: 'f9', type: 'accessibility', available: false },
  { id: 'f10', type: 'cleaning', available: false },
]

