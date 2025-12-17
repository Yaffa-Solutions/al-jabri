'use client';

import { useI18n } from '@/lib/i18n-context';
import { Shield, Clock, Award, Headphones, CreditCard, MapPin } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    textEn: 'Best Price Guarantee',
    textAr: 'ضمان أفضل سعر',
  },
  {
    icon: Clock,
    textEn: '24/7 Support',
    textAr: 'دعم على مدار الساعة',
  },
  {
    icon: CreditCard,
    textEn: 'Secure Payment',
    textAr: 'دفع آمن',
  },
  {
    icon: Award,
    textEn: 'Quality Assured',
    textAr: 'جودة مضمونة',
  },
  {
    icon: MapPin,
    textEn: 'Prime Locations',
    textAr: 'مواقع استراتيجية',
  },
  {
    icon: Headphones,
    textEn: 'Dedicated Service',
    textAr: 'خدمة متميزة',
  },
];

export function TrustStrip() {
  const { locale } = useI18n();

  return (
    <section className="py-6 bg-gradient-to-r from-navy via-navy-light to-navy relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a961' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5 text-white/80 hover:text-gold transition-all duration-300 group cursor-default"
              >
                <div className="p-1.5 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {locale === 'ar' ? item.textAr : item.textEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
