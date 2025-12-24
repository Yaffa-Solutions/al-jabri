'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { MapPin, Building2, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Destination {
  id: string;
  cityEn: string;
  cityAr: string;
  countryEn: string;
  countryAr: string;
  hotels: number;
  image: string;
  rating: number;
  featured?: boolean;
}

const destinations: Destination[] = [
  {
    id: 'mecca',
    cityEn: 'Mecca',
    cityAr: 'مكة المكرمة',
    countryEn: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    hotels: 5,
    image: '/modern-hotel-mecca.jpg',
    rating: 4.9,
    featured: true,
  },
  {
    id: 'madinah',
    cityEn: 'Madinah',
    cityAr: 'المدينة المنورة',
    countryEn: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    hotels: 3,
    image: '/luxury-hotel-exterior-architecture.jpg',
    rating: 4.8,
    featured: true,
  },
  {
    id: 'riyadh',
    cityEn: 'Riyadh',
    cityAr: 'الرياض',
    countryEn: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    hotels: 4,
    image: '/modern-business-hotel-riyadh.jpg',
    rating: 4.7,
  },
  {
    id: 'jeddah',
    cityEn: 'Jeddah',
    cityAr: 'جدة',
    countryEn: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    hotels: 3,
    image: '/luxury-beach-resort-jeddah.jpg',
    rating: 4.6,
  },
];

export function Destinations() {
  const { locale } = useI18n();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {locale === 'ar' ? 'وجهاتنا' : 'Our Destinations'}
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            {locale === 'ar' ? 'اكتشف فنادقنا في المملكة' : 'Discover Our Hotels Across KSA'}
          </h2>
          <p className="text-lg text-navy/60 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'مواقع استراتيجية في أهم المدن السعودية لخدمة ضيوف الرحمن والزوار'
              : 'Strategic locations in major Saudi cities serving pilgrims and visitors'}
          </p>
        </div>

        {/* Destinations Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {destinations.map((dest, index) => {
            const isLarge = dest.featured && index < 2;
            return (
              <Link
                key={dest.id}
                href={`/booking?location=${dest.cityEn.toLowerCase()}`}
                className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                  isLarge ? 'lg:col-span-2 h-80 lg:h-96' : 'h-64 lg:h-80'
                }`}
                onMouseEnter={() => setHoveredId(dest.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${dest.image}')` }}
                />

                {/* Overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  hoveredId === dest.id
                    ? 'bg-navy/60'
                    : 'bg-gradient-to-t from-navy/80 via-navy/30 to-transparent'
                }`} />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  {/* Featured Badge */}
                  {dest.featured && (
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                      <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-navy" />
                        {locale === 'ar' ? 'الأكثر زيارة' : 'Most Visited'}
                      </span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-sm">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="text-white text-sm font-semibold">{dest.rating}</span>
                  </div>

                  {/* City Info */}
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {locale === 'ar' ? dest.cityAr : dest.cityEn}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                      {locale === 'ar' ? dest.countryAr : dest.countryEn}
                    </p>

                    {/* Hotels Count */}
                    <div className="flex items-center gap-2 text-gold">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {dest.hotels} {locale === 'ar' ? 'فنادق' : 'Hotels'}
                      </span>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  <div className={`flex items-center gap-2 text-white mt-4 transition-all duration-500 ${
                    hoveredId === dest.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <span className="text-sm font-medium">
                      {locale === 'ar' ? 'استكشف الفنادق' : 'Explore Hotels'}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-navy/60 mb-4">
            {locale === 'ar'
              ? 'فنادقنا منتشرة في أهم المدن السعودية لخدمتكم'
              : 'Our hotels are spread across major Saudi cities to serve you'}
          </p>
          <Link href="/booking">
            <Button className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-6 rounded-sm group">
              {locale === 'ar' ? 'عرض جميع الفنادق' : 'View All Hotels'}
              <ArrowRight className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Destinations;

