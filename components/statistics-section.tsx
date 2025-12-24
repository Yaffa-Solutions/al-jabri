'use client';

import { useEffect, useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { Building2, Users, Award, Calendar } from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  labelEn: string;
  labelAr: string;
}

const stats: StatItem[] = [
  {
    icon: Building2,
    value: 15,
    suffix: '+',
    labelEn: 'Hotels Managed',
    labelAr: 'فندق مُدار',
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    labelEn: 'Rooms Available',
    labelAr: 'غرفة متاحة',
  },
  {
    icon: Award,
    value: 10,
    suffix: '+',
    labelEn: 'Years Experience',
    labelAr: 'سنوات خبرة',
  },
  {
    icon: Calendar,
    value: 50000,
    suffix: '+',
    labelEn: 'Happy Guests',
    labelAr: 'ضيف سعيد',
  },
];

function useCountUp(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
}

function StatCard({ stat, index, isVisible }: { stat: StatItem; index: number; isVisible: boolean }) {
  const { locale } = useI18n();
  const count = useCountUp(stat.value, 2500, isVisible);
  const Icon = stat.icon;

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(num);
    }
    return num;
  };

  return (
    <div
      className={`text-center group opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-4 group-hover:bg-gold group-hover:text-navy transition-all duration-500 group-hover:scale-110">
        <Icon className="w-7 h-7" />
      </div>

      {/* Number */}
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {formatNumber(count)}
        <span className="text-gold">{stat.suffix}</span>
      </div>

      {/* Label */}
      <p className="text-white/70 text-sm md:text-base font-medium tracking-wide">
        {locale === 'ar' ? stat.labelAr : stat.labelEn}
      </p>

      {/* Decorative line */}
      <div className="mt-4 mx-auto w-12 h-0.5 bg-gold/30 group-hover:w-20 group-hover:bg-gold transition-all duration-500" />
    </div>
  );
}

export function StatisticsSection() {
  const { locale } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy" />
      
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a961' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gold/5 to-transparent" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold/60" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              {locale === 'ar' ? 'إنجازاتنا' : 'Our Achievements'}
            </span>
            <div className="h-px w-12 bg-gold/60" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {locale === 'ar' ? 'أرقام تتحدث عن نفسها' : 'Numbers That Speak'}
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;

