'use client';

import { useI18n } from '@/lib/i18n-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, MessageCircle, Calendar, MapPin } from 'lucide-react';

export function CTASection() {
  const { locale } = useI18n();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('/luxury-hotel-exterior-architecture.jpg')` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/95" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
                {locale === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {locale === 'ar' 
                ? 'هل أنت مستعد لتجربة إقامة استثنائية؟'
                : 'Ready for an Exceptional Stay Experience?'}
            </h2>

            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              {locale === 'ar'
                ? 'احجز الآن واستمتع بأفضل العروض والخصومات الحصرية. فريقنا جاهز لمساعدتك في اختيار الفندق المثالي لرحلتك.'
                : 'Book now and enjoy the best offers and exclusive discounts. Our team is ready to help you choose the perfect hotel for your trip.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto bg-gold hover:bg-gold-light text-navy font-semibold px-8 rounded-sm group">
                  <Calendar className="w-5 h-5 me-2" />
                  {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
                  <ArrowRight className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-gold bg-transparent px-10 py-4 text-lg rounded-sm transition-all duration-300">
                  <MessageCircle className="w-5 h-5 me-2" />
                  {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Contact Cards */}
          <div className="space-y-4">
            {/* Phone Card */}
            <a 
              href="tel:+966000000000"
              className="block bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/15 hover:border-gold/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                  <Phone className="w-6 h-6 text-gold group-hover:text-navy" />
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">
                    {locale === 'ar' ? 'اتصل بنا مباشرة' : 'Call Us Directly'}
                  </p>
                  <p className="text-white text-xl font-bold">+966 00 000 0000</p>
                </div>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a 
              href="https://wa.me/966000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/15 hover:border-gold/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                  <MessageCircle className="w-6 h-6 text-green-500 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">
                    {locale === 'ar' ? 'راسلنا على واتساب' : 'Message Us on WhatsApp'}
                  </p>
                  <p className="text-white text-xl font-bold">
                    {locale === 'ar' ? 'متاحون 24/7' : 'Available 24/7'}
                  </p>
                </div>
              </div>
            </a>

            {/* Location Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">
                    {locale === 'ar' ? 'مواقعنا' : 'Our Locations'}
                  </p>
                  <p className="text-white font-semibold">
                    {locale === 'ar' 
                      ? 'مكة | المدينة | الرياض | جدة'
                      : 'Mecca | Madinah | Riyadh | Jeddah'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
