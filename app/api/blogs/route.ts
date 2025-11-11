import { NextResponse } from "next/server"

// Dummy blog data
const blogs = [
  {
    id: "1",
    title: "Top 10 Luxury Hotels in Saudi Arabia",
    titleAr: "أفضل 10 فنادق فاخرة في المملكة العربية السعودية",
    excerpt: "Discover the most luxurious hotels across the Kingdom",
    excerptAr: "اكتشف أفخم الفنادق في جميع أنحاء المملكة",
    content: "Explore the finest luxury accommodations Saudi Arabia has to offer, from Riyadh to Jeddah and beyond...",
    contentAr: "استكشف أفخم أماكن الإقامة الفاخرة التي تقدمها المملكة العربية السعودية، من الرياض إلى جدة وما بعدها...",
    category: "travel",
    categoryAr: "السفر",
    author: "Sarah Al-Mansour",
    authorAr: "سارة المنصور",
    date: "2025-01-15",
    image: "/luxury-hotel-saudi-arabia.jpg",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "The Future of Hospitality in KSA",
    titleAr: "مستقبل الضيافة في المملكة",
    excerpt: "How technology is transforming the hotel industry",
    excerptAr: "كيف تحول التكنولوجيا صناعة الفنادق",
    content: "The hospitality industry in Saudi Arabia is undergoing a digital transformation...",
    contentAr: "تشهد صناعة الضيافة في المملكة العربية السعودية تحولاً رقمياً...",
    category: "hospitality",
    categoryAr: "الضيافة",
    author: "Mohammed Al-Harbi",
    authorAr: "محمد الحربي",
    date: "2025-01-10",
    image: "/modern-hotel-technology.jpg",
    readTime: "7 min read",
  },
  {
    id: "3",
    title: "Essential Travel Tips for Hotel Stays",
    titleAr: "نصائح السفر الأساسية للإقامة في الفنادق",
    excerpt: "Make the most of your hotel experience",
    excerptAr: "استفد إلى أقصى حد من تجربة الفندق الخاصة بك",
    content: "Whether you are a frequent traveler or planning your first trip, these tips will help...",
    contentAr: "سواء كنت مسافراً متكرراً أو تخطط لرحلتك الأولى، ستساعدك هذه النصائح...",
    category: "tips",
    categoryAr: "نصائح",
    author: "Fatima Al-Zahrani",
    authorAr: "فاطمة الزهراني",
    date: "2025-01-05",
    image: "/hotel-travel-tips.jpg",
    readTime: "4 min read",
  },
  {
    id: "4",
    title: "New Hotel Openings in 2025",
    titleAr: "افتتاحات فنادق جديدة في 2025",
    excerpt: "Exciting new properties coming to Saudi Arabia",
    excerptAr: "منشآت جديدة مثيرة قادمة إلى المملكة",
    content: "Saudi Arabia is welcoming several new luxury hotels this year...",
    contentAr: "ترحب المملكة العربية السعودية بالعديد من الفنادق الفاخرة الجديدة هذا العام...",
    category: "news",
    categoryAr: "أخبار",
    author: "Ahmed Al-Otaibi",
    authorAr: "أحمد العتيبي",
    date: "2025-01-01",
    image: "/new-hotel-opening.jpg",
    readTime: "6 min read",
  },
  {
    id: "5",
    title: "Sustainable Hospitality Practices",
    titleAr: "ممارسات الضيافة المستدامة",
    excerpt: "How hotels are going green in Saudi Arabia",
    excerptAr: "كيف تتجه الفنادق نحو الاستدامة في المملكة",
    content: "Sustainability is becoming a priority for hotels across the Kingdom...",
    contentAr: "أصبحت الاستدامة أولوية للفنادق في جميع أنحاء المملكة...",
    category: "hospitality",
    categoryAr: "الضيافة",
    author: "Layla Al-Dosari",
    authorAr: "ليلى الدوسري",
    date: "2024-12-28",
    image: "/sustainable-eco-hotel.jpg",
    readTime: "5 min read",
  },
  {
    id: "6",
    title: "Best Business Hotels in Riyadh",
    titleAr: "أفضل فنادق الأعمال في الرياض",
    excerpt: "Top choices for business travelers",
    excerptAr: "أفضل الخيارات لمسافري الأعمال",
    content: "For business travelers visiting Riyadh, these hotels offer the perfect combination...",
    contentAr: "بالنسبة لمسافري الأعمال الذين يزورون الرياض، تقدم هذه الفنادق المزيج المثالي...",
    category: "travel",
    categoryAr: "السفر",
    author: "Omar Al-Ghamdi",
    authorAr: "عمر الغامدي",
    date: "2024-12-20",
    image: "/business-hotel-riyadh.jpg",
    readTime: "6 min read",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const category = searchParams.get("category")

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Get specific blog by ID
  if (id) {
    const blog = blogs.find((b) => b.id === id)
    if (blog) {
      return NextResponse.json({ success: true, data: blog })
    }
    return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 })
  }

  // Filter by category if provided
  let filteredBlogs = blogs
  if (category && category !== "all") {
    filteredBlogs = blogs.filter((b) => b.category === category)
  }

  return NextResponse.json({ success: true, data: filteredBlogs })
}
