'use client';

import { useI18n } from '@/lib/i18n-context';
import { Shield, Clock, Award, Headphones, MapPin, Sparkles, Utensils, Car } from 'lucide-react';

const services = [
  {
    icon: Shield,
    titleEn: 'Luxury Accommodations',
    titleAr: 'أماكن إقامة فاخرة',
    descEn: 'Experience premium comfort in our carefully selected hotels with world-class amenities',
    descAr: 'استمتع براحة متميزة في فنادقنا المختارة بعناية مع وسائل راحة عالمية المستوى',
    color: 'gold',
  },
  {
    icon: Clock,
    titleEn: '24/7 Service',
    titleAr: 'خدمة على مدار الساعة',
    descEn: 'Round-the-clock assistance for all your needs with dedicated support team',
    descAr: 'مساعدة على مدار الساعة لجميع احتياجاتك مع فريق دعم متخصص',
    color: 'navy',
  },
  {
    icon: MapPin,
    titleEn: 'Prime Locations',
    titleAr: 'مواقع استراتيجية',
    descEn: 'Strategic locations across Saudi Arabia near major attractions and business centers',
    descAr: 'مواقع استراتيجية في جميع أنحاء المملكة بالقرب من المعالم السياحية ومراكز الأعمال',
    color: 'gold',
  },
  {
    icon: Utensils,
    titleEn: 'Fine Dining',
    titleAr: 'مطاعم راقية',
    descEn: 'World-class cuisine from international and local chefs in our restaurants',
    descAr: 'مأكولات عالمية من طهاة دوليين ومحليين في مطاعمنا',
    color: 'navy',
  },
  {
    icon: Sparkles,
    titleEn: 'Spa & Wellness',
    titleAr: 'سبا وعافية',
    descEn: 'Rejuvenate your body and mind in our premium spa and wellness facilities',
    descAr: 'جدد نشاط جسمك وعقلك في مرافق السبا والعافية المتميزة لدينا',
    color: 'gold',
  },
  {
    icon: Car,
    titleEn: 'Airport Transfer',
    titleAr: 'خدمة التوصيل',
    descEn: 'Complimentary airport transfers and luxury transportation services',
    descAr: 'خدمات النقل المجانية من وإلى المطار وخدمات النقل الفاخرة',
    color: 'navy',
  },
];

export function Features() {
  const { t, locale } = useI18n();

  return (
    <section className="relative py-20 md:py-28 bg-navy overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-gold/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              {locale === 'ar' ? 'خدماتنا' : 'Our Services'}
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('whyChooseUs')}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t('excellence')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isGold = service.color === 'gold';

            return (
              <div
                key={index}
                className={`group relative p-8 rounded-lg transition-all duration-500 opacity-0 animate-fade-in-up ${
                  isGold 
                    ? 'bg-gold/10 hover:bg-gold/20 border border-gold/20' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-6 transition-all duration-500 ${
                  isGold 
                    ? 'bg-gold text-navy group-hover:scale-110' 
                    : 'bg-white/10 text-gold group-hover:bg-gold group-hover:text-navy'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {locale === 'ar' ? service.titleAr : service.titleEn}
                </h3>

                {/* Description */}
                <p className="text-white/60 leading-relaxed text-sm">
                  {locale === 'ar' ? service.descAr : service.descEn}
                </p>

                {/* Decorative Corner */}
                <div className={`absolute bottom-0 right-0 w-16 h-16 opacity-10 ${
                  isGold ? 'bg-gold' : 'bg-white'
                } rounded-tl-full transition-all duration-500 group-hover:w-20 group-hover:h-20`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gold rounded-lg p-8 md:p-12 text-center relative overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1a2c44_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10">
            <Headphones className="w-12 h-12 mx-auto mb-4 text-navy" />
            <h3 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              {locale === 'ar' ? 'هل تحتاج مساعدة في الحجز؟' : 'Need Help With Your Booking?'}
            </h3>
            <p className="text-navy/70 mb-6 max-w-xl mx-auto">
              {locale === 'ar' 
                ? 'فريق خدمة العملاء لدينا متاح على مدار الساعة للمساعدة في أي استفسارات'
                : 'Our customer service team is available 24/7 to assist with any inquiries'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+966000000000"
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-sm transition-all duration-300 hover:shadow-lg"
              >
                <Headphones className="w-5 h-5" />
                {locale === 'ar' ? 'اتصل بنا' : 'Call Us'}
              </a>
              <span className="text-navy font-bold text-xl">+966 00 000 0000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
