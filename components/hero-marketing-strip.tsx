'use client';

import { useI18n } from '@/lib/i18n-context';
import { Star, MapPin, Users, Award } from 'lucide-react';

const highlights = [
  {
    icon: Star,
    valueEn: '4.9',
    valueAr: '٤.٩',
    labelEn: 'Guest Rating',
    labelAr: 'تقييم الضيوف',
    color: 'gold',
  },
  {
    icon: MapPin,
    valueEn: '4',
    valueAr: '٤',
    labelEn: 'Prime Locations',
    labelAr: 'مواقع استراتيجية',
    color: 'navy',
  },
  {
    icon: Users,
    valueEn: '+50K',
    valueAr: '+٥٠ ألف',
    labelEn: 'Happy Guests',
    labelAr: 'ضيف سعيد',
    color: 'gold',
  },
  {
    icon: Award,
    valueEn: '+10',
    valueAr: '+١٠',
    labelEn: 'Years Experience',
    labelAr: 'سنوات خبرة',
    color: 'navy',
  },
];

export function HeroMarketingStrip() {
  const { locale } = useI18n();

  return (
    <section className="relative z-30 -mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Main Marketing Message */}
          <div className="relative bg-gradient-to-r from-navy via-navy-light to-navy px-8 py-10 text-center overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            {/* Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a961' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            
            <div className="relative z-10">
              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold/60" />
                <Star className="w-5 h-5 text-gold fill-gold" />
                <div className="h-px w-8 bg-gold/60" />
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                {locale === 'ar' 
                  ? 'ضيافة استثنائية تليق بضيوف الرحمن'
                  : 'Exceptional Hospitality for Honored Guests'}
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                {locale === 'ar'
                  ? 'نقدم لكم أرقى خدمات الضيافة في مكة المكرمة والمدينة المنورة والرياض وجدة'
                  : 'Premium hospitality services in Mecca, Madinah, Riyadh, and Jeddah'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              const isGold = item.color === 'gold';
              return (
                <div 
                  key={index}
                  className={`relative p-6 lg:p-8 text-center group transition-all duration-300 hover:bg-cream ${
                    index !== highlights.length - 1 ? 'border-e border-gray-100' : ''
                  } ${index < 2 ? 'border-b lg:border-b-0 border-gray-100' : ''}`}
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                    isGold 
                      ? 'bg-gold/10 text-gold group-hover:bg-gold group-hover:text-navy' 
                      : 'bg-navy/5 text-navy group-hover:bg-navy group-hover:text-white'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  {/* Value */}
                  <div className={`text-3xl lg:text-4xl font-bold mb-1 ${isGold ? 'text-gold' : 'text-navy'}`}>
                    {locale === 'ar' ? item.valueAr : item.valueEn}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm text-navy/60 font-medium">
                    {locale === 'ar' ? item.labelAr : item.labelEn}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust Badges */}
          <div className="bg-gradient-to-r from-cream via-white to-cream px-6 py-5 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <span className="flex items-center gap-2 text-navy font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                {locale === 'ar' ? 'أفضل سعر مضمون' : 'Best Price Guarantee'}
              </span>
              <span className="flex items-center gap-2 text-navy font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                {locale === 'ar' ? 'حجز آمن ومضمون' : 'Secure Booking'}
              </span>
              <span className="flex items-center gap-2 text-navy font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                {locale === 'ar' ? 'دعم على مدار الساعة' : '24/7 Support'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroMarketingStrip;
