'use client';

import { useI18n } from '@/lib/i18n-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Phone, Calendar } from 'lucide-react';

interface MarketingBannerProps {
  variant?: 'gold' | 'navy' | 'image' | 'minimal';
}

export function MarketingBanner({ variant = 'gold' }: MarketingBannerProps) {
  const { locale } = useI18n();

  if (variant === 'gold') {
    return (
      <section className="relative py-16 md:py-20 bg-gold overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1a2c44_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-navy text-navy" />
              ))}
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4 leading-tight">
            {locale === 'ar' 
              ? 'ضيافة استثنائية تليق بضيوف الرحمن'
              : 'Exceptional Hospitality for Every Guest'}
          </h2>
          
          <p className="text-xl text-navy/80 mb-8 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'نسعى دائماً لتقديم أفضل تجربة إقامة تجمع بين الراحة والفخامة والموقع المثالي'
              : 'We always strive to provide the best stay experience combining comfort, luxury, and the perfect location'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-navy hover:bg-navy-light text-white font-semibold px-8 rounded-sm group">
                {locale === 'ar' ? 'احجز إقامتك الآن' : 'Book Your Stay Now'}
                <ArrowRight className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Button>
            </Link>
            <a href="tel:+966000000000">
              <Button size="lg" variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold px-8 rounded-sm">
                <Phone className="w-5 h-5 me-2" />
                {locale === 'ar' ? 'اتصل بنا' : 'Call Us'}
              </Button>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'navy') {
    return (
      <section className="relative py-16 md:py-20 bg-navy overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block text-gold text-sm font-medium tracking-[0.3em] uppercase mb-4">
            {locale === 'ar' ? 'منازلي الجابر' : 'Al-Jabri Hotels'}
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {locale === 'ar' 
              ? 'حيث تلتقي الراحة بالفخامة'
              : 'Where Comfort Meets Luxury'}
          </h2>
          
          <div className="w-24 h-1 bg-gold mx-auto mb-6" />
          
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'أكثر من 10 سنوات من الخبرة في تقديم خدمات ضيافة استثنائية في المملكة العربية السعودية'
              : 'Over 10 years of experience providing exceptional hospitality services in Saudi Arabia'}
          </p>

          <Link href="/about">
            <Button size="lg" className="bg-gold hover:bg-gold-light text-navy font-semibold px-10 rounded-sm group">
              {locale === 'ar' ? 'تعرف علينا أكثر' : 'Learn More About Us'}
              <ArrowRight className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (variant === 'image') {
    return (
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url('/luxury-hotel-lobby-modern-design.jpg')` }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-navy/70" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block text-gold text-sm font-medium tracking-[0.3em] uppercase mb-6">
            {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
            {locale === 'ar' 
              ? 'الريادة في تقديم خدمات ضيافة استثنائية تحقق أعلى مستويات رضا العملاء'
              : 'Leading in providing exceptional hospitality services that achieve the highest levels of customer satisfaction'}
          </h2>
          
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-1">15+</div>
              <div className="text-white/60 text-sm">{locale === 'ar' ? 'فندق' : 'Hotels'}</div>
            </div>
            <div className="w-px h-16 bg-white/20" />
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-1">500+</div>
              <div className="text-white/60 text-sm">{locale === 'ar' ? 'غرفة' : 'Rooms'}</div>
            </div>
            <div className="w-px h-16 bg-white/20" />
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-1">50K+</div>
              <div className="text-white/60 text-sm">{locale === 'ar' ? 'ضيف سعيد' : 'Happy Guests'}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Minimal variant
  return (
    <section className="py-12 bg-cream border-y border-gold/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-xl md:text-2xl text-navy font-medium italic">
          {locale === 'ar' 
            ? '"نؤمن بأن كل ضيف يستحق تجربة إقامة لا تُنسى"'
            : '"We believe every guest deserves an unforgettable stay experience"'}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-gold">
          <div className="w-8 h-px bg-gold" />
          <span className="text-sm font-semibold">{locale === 'ar' ? 'منازلي الجابر' : 'Al-Jabri Hotels'}</span>
          <div className="w-8 h-px bg-gold" />
        </div>
      </div>
    </section>
  );
}

export default MarketingBanner;

