'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n-context';
import { ChevronDown, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

const heroSlides = [
  {
    image: '/luxury-hotel-exterior-architecture.jpg',
    titleEn: 'Experience Luxury Hospitality',
    titleAr: 'اكتشف الضيافة الفاخرة',
    subtitleEn: 'Where comfort meets elegance in the heart of Saudi Arabia',
    subtitleAr: 'حيث تلتقي الراحة بالأناقة في قلب المملكة العربية السعودية',
  },
  {
    image: '/luxury-hotel-lobby-modern-design.jpg',
    titleEn: 'Premium Hotels & Resorts',
    titleAr: 'فنادق ومنتجعات متميزة',
    subtitleEn: 'Discover our collection of world-class properties',
    subtitleAr: 'اكتشف مجموعتنا من الفنادق العالمية',
  },
  {
    image: '/modern-hotel-mecca.jpg',
    titleEn: 'Exceptional Service',
    titleAr: 'خدمة استثنائية',
    subtitleEn: 'Creating unforgettable experiences for every guest',
    subtitleAr: 'نخلق تجارب لا تُنسى لكل ضيف',
  },
];

export function HeroSection() {
  const { t, locale } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const currentContent = heroSlides[currentSlide];

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url('${slide.image}')`,
              animation: index === currentSlide ? 'slowZoom 8s ease-out forwards' : 'none',
            }}
          />
        </div>
      ))}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/60 via-navy/50 to-navy-dark/80" />
      
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
              <div className="h-px w-12 bg-gold/60" />
              <span className="text-gold text-sm font-medium tracking-[0.3em] uppercase">
                {locale === 'ar' ? 'منازلي الجابر' : 'Al-Jabri Hotels'}
              </span>
              <div className="h-px w-12 bg-gold/60" />
            </div>

            {/* Main Title */}
            <h1 
              key={currentSlide}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up"
            >
              {locale === 'ar' ? currentContent.titleAr : currentContent.titleEn}
            </h1>

            {/* Subtitle */}
            <p 
              key={`sub-${currentSlide}`}
              className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200"
            >
              {locale === 'ar' ? currentContent.subtitleAr : currentContent.subtitleEn}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-light text-navy font-semibold px-10 py-6 text-lg rounded-sm transition-all duration-300 hover:shadow-xl hover:shadow-gold/30 group"
                >
                  {t('hero.booking')}
                  <ChevronRight className="w-5 h-5 ms-2 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Button>
              </Link>
              <a href="tel:+966000000000">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-gold bg-transparent px-10 py-6 text-lg rounded-sm transition-all duration-300"
                >
                  <Phone className="w-5 h-5 me-2" />
                  {locale === 'ar' ? 'اتصل بنا' : 'Call Us'}
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-32 left-0 right-0 z-20">
          <div className="flex justify-center items-center gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`group relative transition-all duration-300 ${
                  index === currentSlide ? 'w-12' : 'w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-gold'
                      : 'bg-white/40 group-hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs tracking-widest uppercase">
              {locale === 'ar' ? 'استكشف' : 'Explore'}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Keyframes for slow zoom effect */}
      <style jsx>{`
        @keyframes slowZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
