'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Loader2, Wifi, Coffee, Car, Waves, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  breakfast: Coffee,
  parking: Car,
  pool: Waves,
};

// Dummy hotel data for demonstration
const dummyHotels = [
  {
    id: '1',
    name: 'Al-Jabri Royal Suites',
    nameAr: 'أجنحة الجابر الملكية',
    location: 'Mecca, Near Haram',
    locationAr: 'مكة المكرمة، بالقرب من الحرم',
    price: 450,
    rating: 4.9,
    image: '/modern-hotel-mecca.jpg',
    amenities: ['wifi', 'breakfast', 'parking', 'pool'],
  },
  {
    id: '2',
    name: 'Madinah Grand Hotel',
    nameAr: 'فندق المدينة الكبير',
    location: 'Madinah, Central Area',
    locationAr: 'المدينة المنورة، المنطقة المركزية',
    price: 380,
    rating: 4.8,
    image: '/luxury-hotel-exterior-architecture.jpg',
    amenities: ['wifi', 'breakfast', 'parking'],
  },
  {
    id: '3',
    name: 'Riyadh Business Tower',
    nameAr: 'برج الرياض للأعمال',
    location: 'Riyadh, Olaya District',
    locationAr: 'الرياض، حي العليا',
    price: 320,
    rating: 4.7,
    image: '/modern-business-hotel-riyadh.jpg',
    amenities: ['wifi', 'breakfast', 'parking', 'pool'],
  },
  {
    id: '4',
    name: 'Jeddah Waterfront Resort',
    nameAr: 'منتجع جدة الواجهة البحرية',
    location: 'Jeddah, Corniche',
    locationAr: 'جدة، الكورنيش',
    price: 520,
    rating: 4.9,
    image: '/luxury-beach-resort-jeddah.jpg',
    amenities: ['wifi', 'breakfast', 'parking', 'pool'],
  },
  {
    id: '5',
    name: 'Al-Jabri Haram View',
    nameAr: 'الجابر إطلالة الحرم',
    location: 'Mecca, Haram View',
    locationAr: 'مكة المكرمة، إطلالة على الحرم',
    price: 680,
    rating: 5.0,
    image: '/luxury-hotel-lobby-modern-design.jpg',
    amenities: ['wifi', 'breakfast', 'parking'],
  },
  {
    id: '6',
    name: 'Madinah Plaza Hotel',
    nameAr: 'فندق بلازا المدينة',
    location: 'Madinah, Prophet Mosque Area',
    locationAr: 'المدينة المنورة، منطقة المسجد النبوي',
    price: 420,
    rating: 4.8,
    image: '/luxury-hotel-exterior-grand-plaza.jpg',
    amenities: ['wifi', 'breakfast', 'parking', 'pool'],
  },
];

export function FeaturedHotels() {
  const { t, locale } = useI18n();
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/hotels');
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setHotels(data.data.slice(0, 6));
        } else {
          // Use dummy data if no hotels from API
          setHotels(dummyHotels);
        }
      } catch (error) {
        console.error('[v0] Error fetching hotels:', error);
        // Use dummy data on error
        setHotels(dummyHotels);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto" />
          <p className="mt-4 text-navy/60">
            {locale === 'ar' ? 'جاري تحميل الفنادق...' : 'Loading hotels...'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              {locale === 'ar' ? 'فنادقنا' : 'Our Hotels'}
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            {t('hotels.featured')}
          </h2>
          <p className="text-lg text-navy/60 max-w-2xl mx-auto">
            {t('hotels.discover')}
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <div
              key={hotel.id}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={hotel.image || '/placeholder.svg'}
                  alt={locale === 'ar' ? hotel.nameAr : hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Featured Badge */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                  <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                    {locale === 'ar' ? 'مميز' : 'Featured'}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-bold text-navy">{hotel.rating}</span>
                </div>

                {/* Quick View Button - Shows on Hover */}
                <div className="absolute bottom-4 left-4 right-4 rtl:left-4 rtl:right-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <Link href={`/booking?hotelId=${hotel.id}`} className="block">
                    <Button className="w-full bg-gold hover:bg-gold-light text-navy font-semibold">
                      {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Hotel Name */}
                <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">
                  {locale === 'ar' ? hotel.nameAr : hotel.name}
                </h3>

                {/* Location */}
                <div className="flex items-center text-navy/60 text-sm mb-4">
                  <MapPin className="w-4 h-4 me-1 text-gold" />
                  <span className="line-clamp-1">
                    {locale === 'ar' ? hotel.locationAr : hotel.location}
                  </span>
                </div>

                {/* Amenities */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  {(hotel.amenities || ['wifi', 'breakfast', 'parking']).slice(0, 4).map((amenity: string) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    const amenityLabels: Record<string, { en: string; ar: string }> = {
                      wifi: { en: 'WiFi', ar: 'واي فاي' },
                      breakfast: { en: 'Breakfast', ar: 'إفطار' },
                      parking: { en: 'Parking', ar: 'موقف' },
                      pool: { en: 'Pool', ar: 'مسبح' },
                    };
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-1 text-xs text-navy/50"
                        title={locale === 'ar' ? amenityLabels[amenity]?.ar : amenityLabels[amenity]?.en}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {locale === 'ar' ? amenityLabels[amenity]?.ar : amenityLabels[amenity]?.en}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-navy/50 line-through">
                      {locale === 'ar' ? `${Math.round(hotel.price * 1.2 * 3.75)} ر.س` : `$${Math.round(hotel.price * 1.2)}`}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-navy">
                        {locale === 'ar' ? `${Math.round(hotel.price * 3.75)} ر.س` : `$${hotel.price}`}
                      </span>
                      <span className="text-sm text-navy/50">
                        / {t('hotels.night')}
                      </span>
                    </div>
                  </div>
                  <Link href={`/booking?hotelId=${hotel.id}`}>
                    <Button
                      size="sm"
                      className="bg-navy hover:bg-navy-light text-white font-semibold px-6 rounded-sm group/btn"
                    >
                      {t('hotels.bookNow')}
                      <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/booking">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-navy text-navy hover:bg-navy hover:text-white px-10 py-6 rounded-sm font-semibold transition-all duration-300 group"
            >
              {t('hotels.viewAll')}
              <ArrowRight className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedHotels;
