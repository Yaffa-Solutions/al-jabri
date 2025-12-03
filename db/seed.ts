import "dotenv/config"
import { db } from "./index"
import { users, hotels, rooms, blogs, offers } from "./schema"
import { hash } from "bcryptjs"

async function seed() {
  console.log("🌱 Seeding database...")

  try {
    // Create super admin user
    console.log("Creating super admin user...")
    const hashedPassword = await hash("Admin@123", 10)

    const [superAdmin] = await db
      .insert(users)
      .values({
        email: "admin@aljabri.com",
        password: hashedPassword,
        name: "Super Admin",
        phone: "+966500000000",
        role: "super-admin",
        emailVerified: new Date(),
      })
      .returning()

    console.log("✅ Super admin created:", superAdmin.email)

    // Create regular admin user
    const [admin] = await db
      .insert(users)
      .values({
        email: "manager@aljabri.com",
        password: await hash("Admin@123", 10),
        name: "Hotel Manager",
        phone: "+966500000001",
        role: "admin",
        emailVerified: new Date(),
      })
      .returning()

    console.log("✅ Admin created:", admin.email)

    // Create test user
    const [testUser] = await db
      .insert(users)
      .values({
        email: "user@test.com",
        password: await hash("User@123", 10),
        name: "Test User",
        phone: "+966500000002",
        role: "user",
        emailVerified: new Date(),
      })
      .returning()

    console.log("✅ Test user created:", testUser.email)

    // Create hotels
    console.log("Creating hotels...")

    const hotelsData = [
      {
        name: "Luxury Palace Hotel",
        nameAr: "فندق القصر الفاخر",
        location: "Riyadh",
        locationAr: "الرياض",
        description: "Experience ultimate luxury in the heart of Riyadh",
        descriptionAr: "استمتع بالفخامة القصوى في قلب الرياض",
        rating: "4.8",
        reviews: 342,
        mainImage: "/luxury-hotel-riyadh.jpg",
        images: ["/luxury-hotel-riyadh.jpg", "/luxury-hotel-riyadh-2.jpg"],
        amenities: ["Pool", "Spa", "Restaurant", "Gym", "WiFi"],
        amenitiesAr: ["مسبح", "سبا", "مطعم", "صالة رياضية", "واي فاي"],
      },
      {
        name: "Grand Oasis Resort",
        nameAr: "منتجع الواحة الكبرى",
        location: "Jeddah",
        locationAr: "جدة",
        description: "Beachfront paradise with stunning Red Sea views",
        descriptionAr: "جنة على الشاطئ مع إطلالات خلابة على البحر الأحمر",
        rating: "4.6",
        reviews: 289,
        mainImage: "/beachfront-resort-jeddah.jpg",
        images: ["/beachfront-resort-jeddah.jpg"],
        amenities: ["Beach", "Pool", "Restaurant", "WiFi"],
        amenitiesAr: ["شاطئ", "مسبح", "مطعم", "واي فاي"],
      },
      {
        name: "Royal Heights Hotel",
        nameAr: "فندق المرتفعات الملكية",
        location: "Mecca",
        locationAr: "مكة المكرمة",
        description: "Premium accommodation near the Holy Mosque",
        descriptionAr: "إقامة فاخرة بالقرب من الحرم المكي",
        rating: "4.9",
        reviews: 512,
        mainImage: "/modern-hotel-mecca.jpg",
        images: ["/modern-hotel-mecca.jpg"],
        amenities: ["Restaurant", "Room Service", "WiFi", "Parking"],
        amenitiesAr: ["مطعم", "خدمة الغرف", "واي فاي", "موقف سيارات"],
      },
    ]

    const createdHotels = await db.insert(hotels).values(hotelsData).returning()
    console.log(`✅ Created ${createdHotels.length} hotels`)

    // Create rooms for each hotel
    console.log("Creating rooms...")
    const roomsData = []

    for (const hotel of createdHotels) {
      roomsData.push(
        {
          hotelId: hotel.id,
          type: "standard",
          price: "450",
          currency: "USD",
          available: 5,
          description: "Comfortable standard room with modern amenities",
          descriptionAr: "غرفة قياسية مريحة مع وسائل راحة حديثة",
          images: [],
          maxGuests: 2,
        },
        {
          hotelId: hotel.id,
          type: "deluxe",
          price: "650",
          currency: "USD",
          available: 3,
          description: "Spacious deluxe room with premium features",
          descriptionAr: "غرفة ديلوكس واسعة مع ميزات فاخرة",
          images: [],
          maxGuests: 3,
        },
        {
          hotelId: hotel.id,
          type: "suite",
          price: "950",
          currency: "USD",
          available: 2,
          description: "Luxurious suite with separate living area",
          descriptionAr: "جناح فاخر مع منطقة معيشة منفصلة",
          images: [],
          maxGuests: 4,
        },
      )
    }

    const createdRooms = await db.insert(rooms).values(roomsData).returning()
    console.log(`✅ Created ${createdRooms.length} rooms`)

    // Create offers
    console.log("Creating offers...")
    const now = new Date()
    const validFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    const validTo = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    const offersData = [
      {
        name: "Early Bird Special",
        nameAr: "عرض الحجز المبكر",
        hotelId: createdHotels[0].id,
        discountType: "percentage" as const,
        discountValue: "20",
        validFrom,
        validTo,
        active: true,
        conditions: { minNights: 2 },
      },
      {
        name: "Summer Beach Discount",
        nameAr: "خصم الصيف على الشاطئ",
        hotelId: createdHotels[1].id,
        discountType: "percentage" as const,
        discountValue: "15",
        validFrom,
        validTo,
        active: true,
      },
      {
        name: "Weekend Getaway",
        nameAr: "عطلة نهاية الأسبوع",
        roomId: createdRooms[0].id,
        discountType: "fixed" as const,
        discountValue: "100",
        validFrom,
        validTo,
        active: true,
        conditions: { minNights: 2 },
      },
    ]

    const createdOffers = await db.insert(offers).values(offersData).returning()
    console.log(`✅ Created ${createdOffers.length} offers`)

    // Create blogs
    console.log("Creating blogs...")
    const blogsData = [
      {
        authorId: admin.id,
        title: "Top 10 Luxury Hotels in Saudi Arabia",
        titleAr: "أفضل 10 فنادق فاخرة في المملكة العربية السعودية",
        excerpt: "Discover the most luxurious hotels across the Kingdom",
        excerptAr: "اكتشف أفخم الفنادق في جميع أنحاء المملكة",
        content:
          "Explore the finest luxury accommodations Saudi Arabia has to offer, from Riyadh to Jeddah and beyond...",
        contentAr: "استكشف أفخم أماكن الإقامة الفاخرة التي تقدمها المملكة العربية السعودية، من الرياض إلى جدة وما بعدها...",
        category: "travel",
        categoryAr: "السفر",
        coverImage: "/luxury-hotel-saudi-arabia.jpg",
        readTime: "5 min read",
        published: true,
      },
      {
        authorId: admin.id,
        title: "The Future of Hospitality in KSA",
        titleAr: "مستقبل الضيافة في المملكة",
        excerpt: "How technology is transforming the hotel industry",
        excerptAr: "كيف تحول التكنولوجيا صناعة الفنادق",
        content: "The hospitality industry in Saudi Arabia is undergoing a digital transformation...",
        contentAr: "تشهد صناعة الضيافة في المملكة العربية السعودية تحولاً رقمياً...",
        category: "hospitality",
        categoryAr: "الضيافة",
        coverImage: "/modern-hotel-technology.jpg",
        readTime: "7 min read",
        published: true,
      },
      {
        authorId: admin.id,
        title: "Essential Travel Tips for Hotel Stays",
        titleAr: "نصائح السفر الأساسية للإقامة في الفنادق",
        excerpt: "Make the most of your hotel experience",
        excerptAr: "استفد إلى أقصى حد من تجربة الفندق الخاصة بك",
        content: "Whether you are a frequent traveler or planning your first trip, these tips will help...",
        contentAr: "سواء كنت مسافراً متكرراً أو تخطط لرحلتك الأولى، ستساعدك هذه النصائح...",
        category: "tips",
        categoryAr: "نصائح",
        coverImage: "/hotel-travel-tips.jpg",
        readTime: "4 min read",
        published: true,
      },
    ]

    const createdBlogs = await db.insert(blogs).values(blogsData).returning()
    console.log(`✅ Created ${createdBlogs.length} blogs`)

    console.log("\n✨ Database seeded successfully!\n")
    console.log("📝 Login credentials:")
    console.log("Super Admin: admin@aljabri.com / Admin@123")
    console.log("Admin: manager@aljabri.com / Admin@123")
    console.log("User: user@test.com / User@123")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

seed()
  .then(() => {
    console.log("Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Failed:", error)
    process.exit(1)
  })
