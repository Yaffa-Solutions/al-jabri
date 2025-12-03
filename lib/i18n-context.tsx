'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale') as Locale;
    if (storedLocale && (storedLocale === 'en' || storedLocale === 'ar')) {
      setLocaleState(storedLocale);
      document.documentElement.lang = storedLocale;
      document.documentElement.dir = storedLocale === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string) => {
    const translations = locale === 'ar' ? translationsAr : translationsEn;
    return translations[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

const translationsEn: Record<string, string> = {
  'stats.hotels': 'Hotels Managed',
  'stats.rooms': 'Rooms',
  'stats.years': 'Years Experience',
  'stats.guests': 'Happy Guests',

  whyChooseUs: 'Why Choose Us',
  excellence: 'Excellence in every aspect of hospitality',
  // Navigation
  'nav.home': 'Home',
  'nav.about': 'About Us',
  'nav.contact': 'Contact',
  'nav.blogs': 'Blogs',
  'nav.login': 'Login',
  'nav.bookNow': 'Book Now',
  'nav.companyName': 'AL-GABER TOWERS',

  // Hero
  'hero.title': 'Discover Luxury Hotels',
  'hero.subtitle':
    "Experience world-class hospitality in Saudi Arabia's finest hotels",
  'hero.booking': 'Start Booking',
  'hero.secrets': 'Discover Secrets',

  // About
  'about.title': 'ABOUT US',
  'about.subtitle': 'Discover Our Story',
  'about.description': `A specialized company in operating and managing hotels in KSA, dedicated to providing exceptional hospitality services that meet the aspirations of visitors to Kingdom. With the extensive experience of our management team in the hospitality sector, we ensure a comfortable and distinguished stay that reflects the highest standards of quality and professionalism.`,
  'about.visionHistory': 'Our Vision & History',
  // Features
  'features.luxury': 'Luxury Accommodations',
  'features.luxury.desc':
    'Experience premium comfort in our carefully selected hotels',
  'features.service': '24/7 Service',
  'features.service.desc': 'Round-the-clock assistance for all your needs',
  'features.locations': 'Prime Locations',
  'features.locations.desc': 'Strategic locations across Saudi Arabia',

  // Hotels
  'hotels.featured': 'Featured Hotels',
  'hotels.viewAll': 'View All Hotels',
  'hotels.night': 'night',
  'hotels.bookNow': 'Book Now',
  'hotels.discover': 'Discover our carefully selected properties',

  // Search
  'search.destination': 'Where are you going?',
  'search.checkIn': 'Check-in',
  'search.checkOut': 'Check-out',
  'search.guests': 'Guests',
  'search.button': 'Search Hotels',

  // Footer
  'footer.newsletter': 'Subscribe to Newsletter',
  'footer.newsletter.desc': 'Get the latest updates and exclusive offers',
  'footer.email': 'Enter your email',
  'footer.subscribe': 'Subscribe',
  'footer.quickLinks': 'Quick Links',
  'footer.contact': 'Contact',
  'footer.rights': 'All rights reserved',
  'footer.perfectStay': 'Perfect Stay',
  'footer.support': 'Support',
  'footer.helpCenter': 'Help Center',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.termsOfService': 'Terms of Service',

  // Login
  'login.title': 'Welcome Back',
  'login.subtitle': 'Sign in to your account',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.forgot': 'Forgot password?',
  'login.submit': 'Sign In',
  'login.noAccount': "Don't have an account?",
  'login.signup': 'Sign up',

  // Contact
  'contact.title': 'Get In Touch',
  'contact.subtitle':
    "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  'contact.name': 'Name',
  'contact.email': 'Email',
  'contact.subject': 'Subject',
  'contact.message': 'Message',
  'contact.send': 'Send Message',
  'contact.sending': 'Sending...',
  'contact.info': 'Contact Information',
  'contact.infoDesc': 'Reach out to us through any of these channels',
  'contact.phone': 'Phone',
  'contact.address': 'Address',
  'contact.location': 'Location',
  'contact.locationValue': 'Riyadh, Saudi Arabia',
  'contact.formTitle': 'Send us a Message',
  'contact.formDesc': "Fill out the form below and we'll get back to you shortly",
  'contact.namePlaceholder': 'Your name',
  'contact.emailPlaceholder': 'your@email.com',
  'contact.phonePlaceholder': '+966 XX XXX XXXX',
  'contact.messagePlaceholder': 'Tell us how we can help...',
  'contact.success': 'Message sent!',
  'contact.successDesc': 'We will get back to you as soon as possible.',
  'contact.error': 'Failed to send message',
  'contact.errorDesc': 'Please try again later',
  'contact.connectionError': 'Connection error',
  'contact.connectionErrorDesc': 'Please check your internet connection and try again',

  // Booking
  'booking.title': 'Start Booking Your Stay Now',
  'booking.subtitle': 'Find your perfect hotel and book your stay',
  'booking.hotel': 'Select Hotel',
  'booking.checkIn': 'Check-in Date',
  'booking.checkOut': 'Check-out Date',
  'booking.guests': 'Number of Guests',
  'booking.room': 'Room Type',
  'booking.name': 'Full Name',
  'booking.email': 'Email',
  'booking.phone': 'Phone Number',
  'booking.requests': 'Special Requests',
  'booking.submit': 'Complete Booking',
  'Complete Your Booking': 'Complete Your Booking',
  'Fill in your details to confirm your reservation':
    'Fill in your details to confirm your reservation',
  'Personal Information': 'Personal Information',
  'Enter your full name': 'Enter your full name',
  'Email Address': 'Email Address',
  'Phone Number': 'Phone Number',
  'Booking Details': 'Booking Details',
  'Check-in Date': 'Check-in Date',
  'Check-out Date': 'Check-out Date',
  Guests: 'Guests',
  Guest: 'Guest',
  Rooms: 'Rooms',
  Room: 'Room',
  'Special Requests': 'Special Requests',
  Optional: 'Optional',
  'Any special requests or preferences?':
    'Any special requests or preferences?',
  'Payment Information': 'Payment Information',
  'Card Number': 'Card Number',
  'Expiry Date': 'Expiry Date',
  CVV: 'CVV',
  'Confirm Booking': 'Confirm Booking',
  Processing: 'Processing',
  'Back to Search Results': 'Back to Search Results',
  Amenities: 'Amenities',
  'Free WiFi': 'Free WiFi',
  Breakfast: 'Breakfast',
  Gym: 'Gym',
  reviews: 'reviews',
  'Loading hotel details': 'Loading hotel details',
  'Hotel not found': 'Hotel not found',
  'Failed to load hotel details': 'Failed to load hotel details',
  'Booking Confirmed!': 'Booking Confirmed!',
  'Your reservation has been confirmed. Check your email for details.':
    'Your reservation has been confirmed. Check your email for details.',
  'Booking Failed': 'Booking Failed',
  'Please try again': 'Please try again',
  'Connection error': 'Connection error',
  'Please check your internet connection and try again':
    'Please check your internet connection and try again',

  // Search Results
  'No search results found': 'No search results found',
  'Start New Search': 'Start New Search',
  'Search Results': 'Search Results',
  Location: 'Location',
  'All locations': 'All locations',
  'Check-in': 'Check-in',
  'Check-out': 'Check-out',
  Found: 'Found',
  'available hotels': 'available hotels',
  'Back to Search': 'Back to Search',
  night: 'night',
  'Book Now': 'Book Now',

  // Blogs
  'blogs.title': 'Our Blog',
  'blogs.subtitle':
    'Insights, tips, and stories from the world of hospitality management',
  'blogs.readMore': 'Read More',
  'blogs.backToBlogs': 'Back to Blogs',
  'blogs.backToAll': 'Back to All Blogs',
  'blogs.category': 'Category',
  'blogs.author': 'Author',
  'blogs.date': 'Date',
  'blogs.readTime': 'Read Time',
  'blogs.noBlogs': 'No blog posts available yet. Check back soon!',
  'blogs.previewMode': 'Preview Mode - This post is not published yet',
  'blogs.loadingArticle': 'Loading Article...',
  'blogs.notFound': 'Blog Post Not Found',
  'blogs.shareArticle': 'Share this article:',
  'blogs.planStay': 'Plan Your Stay',
  'blogs.planStayDesc': 'Experience the luxury and comfort of Al-Gaber Towers on your next visit to the Kingdom.',
  'blogs.bookNow': 'Book Now',
  'blogs.recentArticles': 'Recent Articles',
  'blogs.viewAllPosts': 'View All Posts',

  // Secrets
  'secrets.title': 'Discover The Secrets Of The Perfect Stay',
  'secrets.titleAr': 'اكتشف أسرار الإقامة المثالية',
  'secrets.subtitle':
    "After decades of hospitality excellence, we're sharing the insider knowledge that separates an ordinary hotel stay from an extraordinary experience. These are the principles we follow in every property we manage.",

  // Secrets - Individual Cards
  'secrets.location.title': 'Choose the Right Location',
  'secrets.location.description':
    'The location sets the tone for your entire stay. Select a hotel that provides easy access to attractions while offering a peaceful retreat.',
  'secrets.location.tip1': 'Research neighborhood safety and accessibility',
  'secrets.location.tip2': 'Consider proximity to transportation hubs',
  'secrets.location.tip3': 'Check nearby dining and entertainment options',

  'secrets.cleanliness.title': 'Prioritize Cleanliness & Safety',
  'secrets.cleanliness.description':
    'A truly perfect stay begins with impeccable hygiene standards and comprehensive safety measures.',
  'secrets.cleanliness.tip1': 'Look for hotels with stringent cleaning protocols',
  'secrets.cleanliness.tip2': 'Verify security measures and emergency procedures',
  'secrets.cleanliness.tip3': 'Read recent guest reviews about cleanliness',

  'secrets.service.title': 'Seek Personalized Service',
  'secrets.service.description':
    'Exceptional hospitality transforms a good stay into an unforgettable experience.',
  'secrets.service.tip1': 'Choose hotels known for attentive staff',
  'secrets.service.tip2': 'Look for personalized welcome amenities',
  'secrets.service.tip3': 'Consider properties with concierge services',

  'secrets.flexibility.title': 'Flexible Check-in & Check-out',
  'secrets.flexibility.description':
    'Travel plans change. Hotels offering flexibility show they value your convenience.',
  'secrets.flexibility.tip1': 'Inquire about early check-in options',
  'secrets.flexibility.tip2': 'Ask about late checkout availability',
  'secrets.flexibility.tip3': 'Look for 24-hour reception services',

  'secrets.amenities.title': 'Quality Amenities Matter',
  'secrets.amenities.description':
    'The right amenities can elevate your stay from ordinary to extraordinary.',
  'secrets.amenities.tip1': 'Verify room amenities match your needs',
  'secrets.amenities.tip2': 'Check for fitness center and pool facilities',
  'secrets.amenities.tip3': 'Look for complimentary services like breakfast',

  'secrets.attention.title': 'Attention to Detail',
  'secrets.attention.description':
    'Small touches make the biggest difference in creating memorable stays.',
  'secrets.attention.tip1': 'Look for thoughtful room design',
  'secrets.attention.tip2': 'Notice welcome gestures and special touches',
  'secrets.attention.tip3': 'Consider hotels with unique character',

  'secrets.cta.title': 'Ready for Your Perfect Stay?',
  'secrets.cta.description':
    'Experience these principles firsthand at any of our managed properties across Saudi Arabia',
  'secrets.cta.button': 'Start Your Booking',

  // About Us - Vision, Mission, Values
  'about.vision.title': 'Our Vision',
  'about.vision.description':
    'To lead in providing exceptional hospitality services that achieve the highest levels of customer satisfaction.',
  'about.mission.title': 'Our Mission',
  'about.mission.description':
    'To provide an exceptional hospitality environment built on quality and innovation, serving the Guests of the Almighty and every visitor to the Kingdom of Saudi Arabia.',
  'about.values.title': 'Our Values',
  'about.values.quality': 'Quality',
  'about.values.professionalism': 'Professionalism',
  'about.values.flexibility': 'Flexibility',

  // Blog Editor
  'blog.editor.title': 'Create New Blog Post',
  'blog.editor.editTitle': 'Edit Blog Post',
  'blog.editor.language': 'Language',
  'blog.editor.content': 'Content',
  'blog.editor.meta': 'Meta',
  'blog.editor.seo': 'SEO',
  'blog.editor.postTitle': 'Post Title',
  'blog.editor.excerpt': 'Excerpt',
  'blog.editor.category': 'Category',
  'blog.editor.tags': 'Tags',
  'blog.editor.coverImage': 'Cover Image',
  'blog.editor.author': 'Author',
  'blog.editor.postDate': 'Post Date',
  'blog.editor.readTime': 'Read Time',
  'blog.editor.published': 'Published',
  'blog.editor.draft': 'Draft',
  'blog.editor.metaDescription': 'Meta Description',
  'blog.editor.metaKeywords': 'Meta Keywords',
  'blog.editor.save': 'Save',
  'blog.editor.saveDraft': 'Save as Draft',
  'blog.editor.publish': 'Publish',
  'blog.editor.cancel': 'Cancel',
  'blog.editor.addTag': 'Add tag',
  'blog.editor.enterTitle': 'Enter post title...',
  'blog.editor.enterExcerpt': 'Brief summary of your post...',
  'blog.editor.enterCategory': 'e.g., Travel Tips, Hotel Reviews',
  'blog.editor.enterMetaDesc':
    'Brief description for search engines (160 characters max)',
  'blog.editor.enterMetaKeywords': 'Comma-separated keywords',
};

const translationsAr: Record<string, string> = {
  'stats.hotels': 'الفنادق المدارة',
  'stats.rooms': 'الغرف',
  'stats.years': 'سنوات الخبرة',
  'stats.guests': 'الضيوف السعداء',

  whyChooseUs: 'لماذا تختارنا',
  excellence: 'التميز في كل جانب من جوانب الضيافة',
  // Navigation
  'nav.home': 'الرئيسية',
  'nav.about': 'من نحن',
  'nav.contact': 'اتصل بنا',
  'nav.blogs': 'المدونات',
  'nav.login': 'تسجيل الدخول',
  'nav.bookNow': 'احجز الان',
  'nav.companyName': 'منازلي الجابر',

  // Hero
  'hero.title': 'اكتشف الفنادق الفاخرة',
  'hero.subtitle':
    'استمتع بالضيافة العالمية في أفضل فنادق المملكة العربية السعودية',
  'hero.booking': 'ابدأ الحجز',
  'hero.secrets': 'اكتشف الأسرار',

  // About
  'about.title': 'من نحن',
  'about.subtitle': 'تعرف على قصتنا',
  'about.description':
    'شركة متخصصة في تشغيل وإدارة الفنادق في المملكة العربية السعودية، حيث نعمل على تقديم خدمات ضيافة مميزة ترتقي لتطلعات زوار المملكة. بفضل خبرة إدارتنا الطويلة في قطاع الضيافة، نضمن تجربة إقامة مريحة ومتميزة تعكس أعلى معايير الجودة والاحترافية.',
  'about.visionHistory': 'رؤيتنا وتاريخنا',
  // Features
  'features.luxury': 'أماكن إقامة فاخرة',
  'features.luxury.desc': 'استمتع براحة متميزة في فنادقنا المختارة بعناية',
  'features.service': 'خدمة على مدار الساعة',
  'features.service.desc': 'مساعدة على مدار الساعة لتلبية جميع احتياجاتك',
  'features.locations': 'مواقع رئيسية',
  'features.locations.desc':
    'مواقع استراتيجية في جميع أنحاء المملكة العربية السعودية',

  // Hotels
  'hotels.featured': 'الفنادق المميزة',
  'hotels.viewAll': 'عرض جميع الفنادق',
  'hotels.night': 'ليلة',
  'hotels.bookNow': 'احجز الآن',
  'hotels.discover': 'اكتشف فنادقنا المختارة بعناية',

  // Search
  'search.destination': 'إلى أين تذهب؟',
  'search.checkIn': 'تسجيل الدخول',
  'search.checkOut': 'تسجيل الخروج',
  'search.guests': 'الضيوف',
  'search.button': 'بحث عن الفنادق',

  // Footer
  'footer.newsletter': 'اشترك في النشرة الإخبارية',
  'footer.newsletter.desc': 'احصل على آخر التحديثات والعروض الحصرية',
  'footer.email': 'أدخل بريدك الإلكتروني',
  'footer.subscribe': 'اشترك',
  'footer.quickLinks': 'روابط سريعة',
  'footer.contact': 'اتصل بنا',
  'footer.rights': 'جميع الحقوق محفوظة',
  'footer.perfectStay': 'إقامة مثالية',
  'footer.helpCenter': 'مركز المساعدة',
  'footer.privacyPolicy': 'سياسة الخصوصية',
  'footer.termsOfService': 'شروط الخدمة',
  'footer.support': 'الدعم',
  // Login
  'login.title': 'مرحباً بعودتك',
  'login.subtitle': 'سجل الدخول إلى حسابك',
  'login.email': 'البريد الإلكتروني',
  'login.password': 'كلمة المرور',
  'login.forgot': 'هل نسيت كلمة المرور؟',
  'login.submit': 'تسجيل الدخول',
  'login.noAccount': 'ليس لديك حساب؟',
  'login.signup': 'إنشاء حساب',

  // Contact
  'contact.title': 'تواصل معنا',
  'contact.subtitle':
    'هل لديك أسئلة؟ نود أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.',
  'contact.name': 'الاسم',
  'contact.email': 'البريد الإلكتروني',
  'contact.subject': 'الموضوع',
  'contact.message': 'الرسالة',
  'contact.send': 'إرسال الرسالة',
  'contact.sending': 'جاري الإرسال...',
  'contact.info': 'معلومات الاتصال',
  'contact.infoDesc': 'تواصل معنا من خلال أي من هذه القنوات',
  'contact.phone': 'الهاتف',
  'contact.address': 'العنوان',
  'contact.location': 'الموقع',
  'contact.locationValue': 'الرياض، المملكة العربية السعودية',
  'contact.formTitle': 'أرسل لنا رسالة',
  'contact.formDesc': 'املأ النموذج أدناه وسنعود إليك قريباً',
  'contact.namePlaceholder': 'اسمك',
  'contact.emailPlaceholder': 'بريدك@الإلكتروني.com',
  'contact.phonePlaceholder': '+966 XX XXX XXXX',
  'contact.messagePlaceholder': 'أخبرنا كيف يمكننا مساعدتك...',
  'contact.success': 'تم إرسال الرسالة!',
  'contact.successDesc': 'سنعود إليك في أقرب وقت ممكن.',
  'contact.error': 'فشل إرسال الرسالة',
  'contact.errorDesc': 'يرجى المحاولة مرة أخرى لاحقاً',
  'contact.connectionError': 'خطأ في الاتصال',
  'contact.connectionErrorDesc': 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى',

  // Booking
  'booking.title': 'ابدأ حجز إقامتك الآن',
  'booking.subtitle': 'ابحث عن الفندق المثالي واحجز إقامتك',
  'booking.hotel': 'اختر الفندق',
  'booking.checkIn': 'تاريخ تسجيل الوصول',
  'booking.checkOut': 'تاريخ تسجيل المغادرة',
  'booking.guests': 'عدد الضيوف',
  'booking.room': 'نوع الغرفة',
  'booking.name': 'الاسم الكامل',
  'booking.email': 'البريد الإلكتروني',
  'booking.phone': 'رقم الهاتف',
  'booking.requests': 'طلبات خاصة',
  'booking.submit': 'إتمام الحجز',
  'Complete Your Booking': 'أكمل حجزك',
  'Fill in your details to confirm your reservation':
    'املأ بياناتك لتأكيد الحجز',
  'Personal Information': 'المعلومات الشخصية',
  'Enter your full name': 'أدخل اسمك الكامل',
  'Email Address': 'عنوان البريد الإلكتروني',
  'Phone Number': 'رقم الهاتف',
  'Booking Details': 'تفاصيل الحجز',
  'Check-in Date': 'تاريخ تسجيل الوصول',
  'Check-out Date': 'تاريخ تسجيل المغادرة',
  Guests: 'الضيوف',
  Guest: 'ضيف',
  Rooms: 'الغرف',
  Room: 'غرفة',
  'Special Requests': 'طلبات خاصة',
  Optional: 'اختياري',
  'Any special requests or preferences?': 'هل لديك أي طلبات أو تفضيلات خاصة؟',
  'Payment Information': 'معلومات الدفع',
  'Card Number': 'رقم البطاقة',
  'Expiry Date': 'تاريخ الانتهاء',
  CVV: 'رمز الأمان',
  'Confirm Booking': 'تأكيد الحجز',
  Processing: 'جاري المعالجة',
  'Back to Search Results': 'العودة إلى نتائج البحث',
  Amenities: 'المرافق',
  'Free WiFi': 'واي فاي مجاني',
  Breakfast: 'الإفطار',
  Gym: 'صالة رياضية',
  reviews: 'تقييم',
  'Loading hotel details': 'جاري تحميل تفاصيل الفندق',
  'Hotel not found': 'الفندق غير موجود',
  'Failed to load hotel details': 'فشل تحميل تفاصيل الفندق',
  'Booking Confirmed!': 'تم تأكيد الحجز!',
  'Your reservation has been confirmed. Check your email for details.':
    'تم تأكيد حجزك. تحقق من بريدك الإلكتروني للحصول على التفاصيل.',
  'Booking Failed': 'فشل الحجز',
  'Please try again': 'يرجى المحاولة مرة أخرى',
  'Connection error': 'خطأ في الاتصال',
  'Please check your internet connection and try again':
    'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى',

  // Search Results
  'No search results found': 'لم يتم العثور على نتائج بحث',
  'Start New Search': 'بدء بحث جديد',
  'Search Results': 'نتائج البحث',
  Location: 'الموقع',
  'All locations': 'جميع المواقع',
  'Check-in': 'تسجيل الوصول',
  'Check-out': 'تسجيل المغادرة',
  Found: 'تم العثور على',
  'available hotels': 'فندق متاح',
  'Back to Search': 'العودة إلى البحث',
  night: 'ليلة',
  'Book Now': 'احجز الآن',

  // Blogs
  'blogs.title': 'مدونتنا',
  'blogs.subtitle': 'رؤى ونصائح وقصص من عالم إدارة الضيافة',
  'blogs.readMore': 'اقرأ المزيد',
  'blogs.backToBlogs': 'العودة إلى المدونات',
  'blogs.backToAll': 'العودة إلى جميع المدونات',
  'blogs.category': 'الفئة',
  'blogs.author': 'الكاتب',
  'blogs.date': 'التاريخ',
  'blogs.readTime': 'وقت القراءة',
  'blogs.noBlogs': 'لا توجد مقالات متاحة حتى الآن. تحقق لاحقاً!',
  'blogs.previewMode': 'وضع المعاينة - هذا المنشور غير منشور بعد',
  'blogs.loadingArticle': 'جاري تحميل المقال...',
  'blogs.notFound': 'المقال غير موجود',
  'blogs.shareArticle': 'شارك هذا المقال:',
  'blogs.planStay': 'خطط لإقامتك',
  'blogs.planStayDesc': 'اختبر الفخامة والراحة في منازل الجابر في زيارتك القادمة للمملكة.',
  'blogs.bookNow': 'احجز الآن',
  'blogs.recentArticles': 'المقالات الحديثة',
  'blogs.viewAllPosts': 'عرض جميع المقالات',

  // Secrets
  'secrets.title': 'اكتشف أسرار الإقامة المثالية',
  'secrets.titleAr': 'اكتشف أسرار الإقامة المثالية',
  'secrets.subtitle':
    'بعد عقود من التميز في مجال الضيافة، نشارككم المعرفة الداخلية التي تفصل بين الإقامة العادية والتجربة الاستثنائية. هذه هي المبادئ التي نتبعها في كل فندق نديره.',

  // Secrets - Individual Cards
  'secrets.location.title': 'اختر الموقع المناسب',
  'secrets.location.description':
    'الموقع يحدد طابع إقامتك بالكامل. اختر فندقاً يوفر سهولة الوصول إلى المعالم السياحية مع توفير ملاذ هادئ.',
  'secrets.location.tip1': 'ابحث عن سلامة الحي وإمكانية الوصول',
  'secrets.location.tip2': 'خذ في الاعتبار القرب من مراكز النقل',
  'secrets.location.tip3': 'تحقق من خيارات تناول الطعام والترفيه القريبة',

  'secrets.cleanliness.title': 'أعط الأولوية للنظافة والسلامة',
  'secrets.cleanliness.description':
    'الإقامة المثالية تبدأ بمعايير نظافة لا تشوبها شائبة وتدابير سلامة شاملة.',
  'secrets.cleanliness.tip1': 'ابحث عن الفنادق ذات بروتوكولات التنظيف الصارمة',
  'secrets.cleanliness.tip2': 'تحقق من التدابير الأمنية وإجراءات الطوارئ',
  'secrets.cleanliness.tip3': 'اقرأ تقييمات الضيوف الحديثة حول النظافة',

  'secrets.service.title': 'ابحث عن خدمة شخصية',
  'secrets.service.description':
    'الضيافة الاستثنائية تحول الإقامة الجيدة إلى تجربة لا تُنسى.',
  'secrets.service.tip1': 'اختر الفنادق المعروفة بطاقم العمل المهتم',
  'secrets.service.tip2': 'ابحث عن وسائل الراحة الترحيبية الشخصية',
  'secrets.service.tip3': 'فكر في الفنادق التي تقدم خدمات الكونسيرج',

  'secrets.flexibility.title': 'مرونة الدخول والخروج',
  'secrets.flexibility.description':
    'خطط السفر تتغير. الفنادق التي تقدم المرونة تظهر أنها تقدر راحتك.',
  'secrets.flexibility.tip1': 'استفسر عن خيارات تسجيل الوصول المبكر',
  'secrets.flexibility.tip2': 'اسأل عن توفر تسجيل المغادرة المتأخر',
  'secrets.flexibility.tip3': 'ابحث عن خدمات الاستقبال على مدار 24 ساعة',

  'secrets.amenities.title': 'جودة المرافق مهمة',
  'secrets.amenities.description':
    'المرافق المناسبة يمكن أن ترفع إقامتك من عادية إلى استثنائية.',
  'secrets.amenities.tip1': 'تحقق من أن مرافق الغرفة تتناسب مع احتياجاتك',
  'secrets.amenities.tip2': 'تحقق من مرافق مركز اللياقة البدنية والمسبح',
  'secrets.amenities.tip3': 'ابحث عن الخدمات المجانية مثل الإفطار',

  'secrets.attention.title': 'الاهتمام بالتفاصيل',
  'secrets.attention.description':
    'اللمسات الصغيرة تحدث أكبر فرق في خلق إقامات لا تُنسى.',
  'secrets.attention.tip1': 'ابحث عن تصميم الغرفة المدروس',
  'secrets.attention.tip2': 'لاحظ إيماءات الترحيب واللمسات الخاصة',
  'secrets.attention.tip3': 'فكر في الفنادق ذات الطابع الفريد',

  'secrets.cta.title': 'هل أنت مستعد لإقامتك المثالية؟',
  'secrets.cta.description':
    'جرب هذه المبادئ بنفسك في أي من فنادقنا المدارة في جميع أنحاء المملكة العربية السعودية',
  'secrets.cta.button': 'ابدأ حجزك',

  // About Us - Vision, Mission, Values
  'about.vision.title': 'رؤيتنا',
  'about.vision.description':
    'الريادة في تقديم خدمات ضيافة استثنائية تحقق أعلى مستويات رضا العملاء.',
  'about.mission.title': 'مهمتنا',
  'about.mission.description':
    'تقديم بيئة ضيافة استثنائية قائمة على الجودة والابتكار، لخدمة ضيوف الرحمن وكل زائر للمملكة العربية السعودية.',
  'about.values.title': 'قيمنا',
  'about.values.quality': 'الجودة',
  'about.values.professionalism': 'الاحترافية',
  'about.values.flexibility': 'المرونة',

  // Blog Editor
  'blog.editor.title': 'إنشاء مقال جديد',
  'blog.editor.editTitle': 'تعديل المقال',
  'blog.editor.language': 'اللغة',
  'blog.editor.content': 'المحتوى',
  'blog.editor.meta': 'البيانات',
  'blog.editor.seo': 'تحسين محركات البحث',
  'blog.editor.postTitle': 'عنوان المقال',
  'blog.editor.excerpt': 'المقتطف',
  'blog.editor.category': 'الفئة',
  'blog.editor.tags': 'الوسوم',
  'blog.editor.coverImage': 'الصورة الرئيسية',
  'blog.editor.author': 'الكاتب',
  'blog.editor.postDate': 'تاريخ النشر',
  'blog.editor.readTime': 'وقت القراءة',
  'blog.editor.published': 'منشور',
  'blog.editor.draft': 'مسودة',
  'blog.editor.metaDescription': 'الوصف التعريفي',
  'blog.editor.metaKeywords': 'الكلمات المفتاحية',
  'blog.editor.save': 'حفظ',
  'blog.editor.saveDraft': 'حفظ كمسودة',
  'blog.editor.publish': 'نشر',
  'blog.editor.cancel': 'إلغاء',
  'blog.editor.addTag': 'إضافة وسم',
  'blog.editor.enterTitle': 'أدخل عنوان المقال...',
  'blog.editor.enterExcerpt': 'ملخص مختصر للمقال...',
  'blog.editor.enterCategory': 'مثال: نصائح السفر، تقييمات الفنادق',
  'blog.editor.enterMetaDesc': 'وصف مختصر لمحركات البحث (160 حرف كحد أقصى)',
  'blog.editor.enterMetaKeywords': 'كلمات مفتاحية مفصولة بفواصل',
};
