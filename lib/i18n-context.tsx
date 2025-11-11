"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

type Locale = "en" | "ar"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale") as Locale
    if (storedLocale && (storedLocale === "en" || storedLocale === "ar")) {
      setLocaleState(storedLocale)
      document.documentElement.lang = storedLocale
      document.documentElement.dir = storedLocale === "ar" ? "rtl" : "ltr"
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"
  }

  const t = (key: string) => {
    const translations = locale === "ar" ? translationsAr : translationsEn
    return translations[key] || key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}

const translationsEn: Record<string, string> = {
  // Navigation
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.contact": "Contact",
  "nav.blogs": "Blogs",
  "nav.login": "Login",

  // Hero
  "hero.title": "Discover Luxury Hotels",
  "hero.subtitle": "Experience world-class hospitality in Saudi Arabia's finest hotels",
  "hero.booking": "Start Booking",
  "hero.secrets": "Discover Secrets",

  // About
  "about.title": "ABOUT US",
  "about.subtitle": "من نحن",
  "about.description":
    "A specialized company in operating and managing hotels in KSA, dedicated to providing exceptional hospitality services that meet the aspirations of visitors to Kingdom. With the extensive experience of our management team in the hospitality sector, we ensure a comfortable and distinguished stay that reflects the highest standards of quality and professionalism.",
  "about.description.ar":
    "شركة متخصصة في تشغيل وإدارة الفنادق في المملكة العربية السعودية، حيث نعمل على تقديم خدمات ضيافة مميزة ترتقي لتطلعات زوار المملكة. بفضل خبرة إدارتنا الطويلة في قطاع الضيافة، نضمن تجربة إقامة مريحة ومتميزة تعكس أعلى معايير الجودة والاحترافية.",

  // Features
  "features.luxury": "Luxury Accommodations",
  "features.luxury.desc": "Experience premium comfort in our carefully selected hotels",
  "features.service": "24/7 Service",
  "features.service.desc": "Round-the-clock assistance for all your needs",
  "features.locations": "Prime Locations",
  "features.locations.desc": "Strategic locations across Saudi Arabia",
  "features.dining": "Fine Dining",
  "features.dining.desc": "Exceptional culinary experiences at every property",

  // Hotels
  "hotels.featured": "Featured Hotels",
  "hotels.viewAll": "View All Hotels",
  "hotels.night": "night",
  "hotels.bookNow": "Book Now",

  // Search
  "search.destination": "Where are you going?",
  "search.checkIn": "Check-in",
  "search.checkOut": "Check-out",
  "search.guests": "Guests",
  "search.button": "Search Hotels",

  // Footer
  "footer.newsletter": "Subscribe to Newsletter",
  "footer.newsletter.desc": "Get the latest updates and exclusive offers",
  "footer.email": "Enter your email",
  "footer.subscribe": "Subscribe",
  "footer.quickLinks": "Quick Links",
  "footer.contact": "Contact",
  "footer.rights": "All rights reserved",

  // Login
  "login.title": "Welcome Back",
  "login.subtitle": "Sign in to your account",
  "login.email": "Email",
  "login.password": "Password",
  "login.forgot": "Forgot password?",
  "login.submit": "Sign In",
  "login.noAccount": "Don't have an account?",
  "login.signup": "Sign up",

  // Contact
  "contact.title": "Get in Touch",
  "contact.subtitle": "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  "contact.name": "Full Name",
  "contact.email": "Email",
  "contact.subject": "Subject",
  "contact.message": "Message",
  "contact.send": "Send Message",
  "contact.info": "Contact Information",
  "contact.phone": "Phone",
  "contact.address": "Address",

  // Booking
  "booking.title": "Start Booking Your Stay Now",
  "booking.subtitle": "Find your perfect hotel and book your stay",
  "booking.hotel": "Select Hotel",
  "booking.checkIn": "Check-in Date",
  "booking.checkOut": "Check-out Date",
  "booking.guests": "Number of Guests",
  "booking.room": "Room Type",
  "booking.name": "Full Name",
  "booking.email": "Email",
  "booking.phone": "Phone Number",
  "booking.requests": "Special Requests",
  "booking.submit": "Complete Booking",

  // Blogs
  "blogs.title": "Our Blog",
  "blogs.subtitle": "Latest insights and stories from the hospitality world",
  "blogs.readMore": "Read More",

  // Secrets
  "secrets.title": "Discover The Secrets Of The Perfect Stay",
  "secrets.subtitle": "Learn insider tips for making the most of your hotel experience",
}

const translationsAr: Record<string, string> = {
  // Navigation
  "nav.home": "الرئيسية",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.blogs": "المدونات",
  "nav.login": "تسجيل الدخول",

  // Hero
  "hero.title": "اكتشف الفنادق الفاخرة",
  "hero.subtitle": "استمتع بالضيافة العالمية في أفضل فنادق المملكة العربية السعودية",
  "hero.booking": "ابدأ الحجز",
  "hero.secrets": "اكتشف الأسرار",

  // About
  "about.title": "من نحن",
  "about.subtitle": "ABOUT US",
  "about.description":
    "شركة متخصصة في تشغيل وإدارة الفنادق في المملكة العربية السعودية، حيث نعمل على تقديم خدمات ضيافة مميزة ترتقي لتطلعات زوار المملكة. بفضل خبرة إدارتنا الطويلة في قطاع الضيافة، نضمن تجربة إقامة مريحة ومتميزة تعكس أعلى معايير الجودة والاحترافية.",
  "about.description.ar":
    "A specialized company in operating and managing hotels in KSA, dedicated to providing exceptional hospitality services that meet the aspirations of visitors to Kingdom. With the extensive experience of our management team in the hospitality sector, we ensure a comfortable and distinguished stay that reflects the highest standards of quality and professionalism.",

  // Features
  "features.luxury": "أماكن إقامة فاخرة",
  "features.luxury.desc": "استمتع براحة متميزة في فنادقنا المختارة بعناية",
  "features.service": "خدمة على مدار الساعة",
  "features.service.desc": "مساعدة على مدار الساعة لتلبية جميع احتياجاتك",
  "features.locations": "مواقع رئيسية",
  "features.locations.desc": "مواقع استراتيجية في جميع أنحاء المملكة العربية السعودية",
  "features.dining": "تجربة طعام فاخرة",
  "features.dining.desc": "تجارب طهي استثنائية في كل فندق",

  // Hotels
  "hotels.featured": "الفنادق المميزة",
  "hotels.viewAll": "عرض جميع الفنادق",
  "hotels.night": "ليلة",
  "hotels.bookNow": "احجز الآن",

  // Search
  "search.destination": "إلى أين تذهب؟",
  "search.checkIn": "تسجيل الدخول",
  "search.checkOut": "تسجيل الخروج",
  "search.guests": "الضيوف",
  "search.button": "بحث عن الفنادق",

  // Footer
  "footer.newsletter": "اشترك في النشرة الإخبارية",
  "footer.newsletter.desc": "احصل على آخر التحديثات والعروض الحصرية",
  "footer.email": "أدخل بريدك الإلكتروني",
  "footer.subscribe": "اشترك",
  "footer.quickLinks": "روابط سريعة",
  "footer.contact": "اتصل بنا",
  "footer.rights": "جميع الحقوق محفوظة",

  // Login
  "login.title": "مرحباً بعودتك",
  "login.subtitle": "سجل الدخول إلى حسابك",
  "login.email": "البريد الإلكتروني",
  "login.password": "كلمة المرور",
  "login.forgot": "هل نسيت كلمة المرور؟",
  "login.submit": "تسجيل الدخول",
  "login.noAccount": "ليس لديك حساب؟",
  "login.signup": "إنشاء حساب",

  // Contact
  "contact.title": "تواصل معنا",
  "contact.subtitle": "نود أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.",
  "contact.name": "الاسم الكامل",
  "contact.email": "البريد الإلكتروني",
  "contact.subject": "الموضوع",
  "contact.message": "الرسالة",
  "contact.send": "إرسال الرسالة",
  "contact.info": "معلومات الاتصال",
  "contact.phone": "الهاتف",
  "contact.address": "العنوان",

  // Booking
  "booking.title": "ابدأ حجز إقامتك الآن",
  "booking.subtitle": "ابحث عن الفندق المثالي واحجز إقامتك",
  "booking.hotel": "اختر الفندق",
  "booking.checkIn": "تاريخ تسجيل الوصول",
  "booking.checkOut": "تاريخ تسجيل المغادرة",
  "booking.guests": "عدد الضيوف",
  "booking.room": "نوع الغرفة",
  "booking.name": "الاسم الكامل",
  "booking.email": "البريد الإلكتروني",
  "booking.phone": "رقم الهاتف",
  "booking.requests": "طلبات خاصة",
  "booking.submit": "إتمام الحجز",

  // Blogs
  "blogs.title": "مدونتنا",
  "blogs.subtitle": "أحدث الرؤى والقصص من عالم الضيافة",
  "blogs.readMore": "اقرأ المزيد",

  // Secrets
  "secrets.title": "اكتشف أسرار الإقامة المثالية",
  "secrets.subtitle": "تعلم نصائح من الداخل لتحقيق أقصى استفادة من تجربة الفندق",
}
