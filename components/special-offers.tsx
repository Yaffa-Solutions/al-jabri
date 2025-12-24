'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n-context';
import { Calendar, Clock, ArrowRight, Percent, Gift, Star } from 'lucide-react';

interface Offer {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  discount: number;
  image: string;
  validUntil: string;
  badge: string;
  badgeAr: string;
}

const offers: Offer[] = [
  {
    id: '1',
    titleEn: 'Early Bird Discount',
    titleAr: 'خصم الحجز المبكر',
    descriptionEn: 'Book 30 days in advance and get up to 25% off on all room types. Perfect for planning ahead.',
    descriptionAr: 'احجز قبل 30 يومًا واحصل على خصم يصل إلى 25% على جميع أنواع الغرف. مثالي للتخطيط المسبق.',
    discount: 25,
    image: '/luxury-hotel-exterior-architecture.jpg',
    validUntil: '2025-03-31',
    badge: 'Popular',
    badgeAr: 'الأكثر طلباً',
  },
  {
    id: '2',
    titleEn: 'Weekend Getaway',
    titleAr: 'عطلة نهاية الأسبوع',
    descriptionEn: 'Enjoy a special weekend rate with complimentary breakfast and late checkout.',
    descriptionAr: 'استمتع بسعر خاص لعطلة نهاية الأسبوع مع إفطار مجاني وتسجيل خروج متأخر.',
    discount: 20,
    image: '/luxury-hotel-lobby-modern-design.jpg',
    validUntil: '2025-06-30',
    badge: 'New',
    badgeAr: 'جديد',
  },
  {
    id: '3',
    titleEn: 'Extended Stay Offer',
    titleAr: 'عرض الإقامة الممتدة',
    descriptionEn: 'Stay 7 nights and pay for only 5. Ideal for business trips and long vacations.',
    descriptionAr: 'أقم 7 ليالٍ وادفع مقابل 5 فقط. مثالي لرحلات العمل والإجازات الطويلة.',
    discount: 30,
    image: '/modern-hotel-mecca.jpg',
    validUntil: '2025-12-31',
    badge: 'Best Value',
    badgeAr: 'أفضل قيمة',
  },
];

export function SpecialOffers() {
  const { locale } = useI18n();
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const times: Record<string, string> = {};
      offers.forEach((offer) => {
        const difference = new Date(offer.validUntil).getTime() - new Date().getTime();
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          times[offer.id] = locale === 'ar' ? `${days} يوم متبقي` : `${days} days left`;
        } else {
          times[offer.id] = locale === 'ar' ? 'انتهى العرض' : 'Expired';
        }
      });
      setTimeLeft(times);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [locale]);

  return (
    <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase flex items-center gap-2">
              <Gift className="w-4 h-4" />
              {locale === 'ar' ? 'عروض خاصة' : 'Special Offers'}
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            {locale === 'ar' ? 'عروض حصرية لضيوفنا' : 'Exclusive Deals for Our Guests'}
          </h2>
          <p className="text-lg text-navy/60 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'استفد من عروضنا الموسمية واحجز إقامتك بأفضل الأسعار'
              : 'Take advantage of our seasonal offers and book your stay at the best prices'}
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={offer.image}
                  alt={locale === 'ar' ? offer.titleAr : offer.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />

                {/* Discount Badge */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                  <div className="bg-gold text-navy font-bold px-3 py-2 rounded-sm flex items-center gap-1">
                    <Percent className="w-4 h-4" />
                    <span className="text-xl">{offer.discount}%</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-navy text-xs font-bold px-3 py-1 rounded-full">
                    {locale === 'ar' ? offer.badgeAr : offer.badge}
                  </span>
                </div>

                {/* Timer */}
                <div className="absolute bottom-4 left-4 right-4 rtl:left-4 rtl:right-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Clock className="w-4 h-4 text-gold" />
                    <span>{timeLeft[offer.id]}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  {locale === 'ar' ? offer.titleAr : offer.titleEn}
                </h3>
                <p className="text-navy/60 text-sm mb-4 line-clamp-2">
                  {locale === 'ar' ? offer.descriptionAr : offer.descriptionEn}
                </p>

                {/* Valid Until */}
                <div className="flex items-center gap-2 text-sm text-navy/50 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {locale === 'ar' ? 'صالح حتى: ' : 'Valid until: '}
                    {new Date(offer.validUntil).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>

                {/* CTA */}
                <Link href="/booking">
                  <Button className="w-full bg-navy hover:bg-navy-light text-white font-semibold rounded-sm group/btn">
                    {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
                    <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Offers */}
        <div className="text-center mt-12">
          <Link href="/booking">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gold text-gold hover:bg-gold hover:text-navy px-10 py-6 rounded-sm font-semibold transition-all duration-300 group"
            >
              {locale === 'ar' ? 'عرض جميع العروض' : 'View All Offers'}
              <ArrowRight className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SpecialOffers;

