'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Testimonial {
  id: string;
  nameEn: string;
  nameAr: string;
  locationEn: string;
  locationAr: string;
  rating: number;
  textEn: string;
  textAr: string;
  date: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    nameEn: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    locationEn: 'Riyadh, KSA',
    locationAr: 'الرياض، السعودية',
    rating: 5,
    textEn: 'Exceptional service and hospitality! The staff went above and beyond to make our stay comfortable. The room was spotless and the location was perfect for our pilgrimage.',
    textAr: 'خدمة وضيافة استثنائية! بذل الموظفون قصارى جهدهم لجعل إقامتنا مريحة. كانت الغرفة نظيفة تمامًا والموقع مثالي لأداء مناسكنا.',
    date: '2024-12-01',
  },
  {
    id: '2',
    nameEn: 'Fatima Hassan',
    nameAr: 'فاطمة حسن',
    locationEn: 'Cairo, Egypt',
    locationAr: 'القاهرة، مصر',
    rating: 5,
    textEn: 'A truly memorable experience. The hotel\'s proximity to the Haram made our Umrah journey so much easier. Will definitely return!',
    textAr: 'تجربة لا تُنسى حقًا. قرب الفندق من الحرم جعل رحلة العمرة أسهل بكثير. سنعود بالتأكيد!',
    date: '2024-11-15',
  },
  {
    id: '3',
    nameEn: 'Mohammed Al-Kuwaiti',
    nameAr: 'محمد الكويتي',
    locationEn: 'Kuwait City, Kuwait',
    locationAr: 'مدينة الكويت، الكويت',
    rating: 5,
    textEn: 'Five-star service at very reasonable prices. The breakfast buffet was excellent with a great variety of Arabic and international dishes.',
    textAr: 'خدمة خمس نجوم بأسعار معقولة جدًا. بوفيه الإفطار كان ممتازًا مع تنوع كبير من الأطباق العربية والعالمية.',
    date: '2024-10-20',
  },
  {
    id: '4',
    nameEn: 'Sara Al-Dosari',
    nameAr: 'سارة الدوسري',
    locationEn: 'Jeddah, KSA',
    locationAr: 'جدة، السعودية',
    rating: 5,
    textEn: 'Perfect for family stays. The rooms are spacious and well-equipped. The staff was incredibly helpful with our children.',
    textAr: 'مثالي للإقامة العائلية. الغرف واسعة ومجهزة بشكل جيد. كان الموظفون متعاونين للغاية مع أطفالنا.',
    date: '2024-09-10',
  },
];

export function Testimonials() {
  const { locale } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-28 bg-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Large Quote Icon */}
      <div className="absolute top-20 left-10 opacity-5">
        <Quote className="w-64 h-64 text-gold" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              {locale === 'ar' ? 'آراء ضيوفنا' : 'Guest Reviews'}
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {locale === 'ar' ? 'ماذا يقول ضيوفنا' : 'What Our Guests Say'}
          </h2>
        </div>

        {/* Main Testimonial */}
        <div className="relative">
          <div 
            key={currentTestimonial.id}
            className="text-center animate-fade-in"
          >
            {/* Quote Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                <Quote className="w-8 h-8 text-gold" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < currentTestimonial.rating
                      ? 'fill-gold text-gold'
                      : 'fill-white/20 text-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
              "{locale === 'ar' ? currentTestimonial.textAr : currentTestimonial.textEn}"
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-center gap-4">
              {currentTestimonial.avatar ? (
                <img
                  src={currentTestimonial.avatar}
                  alt={locale === 'ar' ? currentTestimonial.nameAr : currentTestimonial.nameEn}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold">
                  <User className="w-7 h-7 text-gold" />
                </div>
              )}
              <div className="text-start">
                <p className="text-white font-semibold text-lg">
                  {locale === 'ar' ? currentTestimonial.nameAr : currentTestimonial.nameEn}
                </p>
                <p className="text-white/60 text-sm">
                  {locale === 'ar' ? currentTestimonial.locationAr : currentTestimonial.locationEn}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold transition-all duration-300 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold transition-all duration-300 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-gold rounded-full'
                  : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-1">4.8</div>
            <p className="text-white/60 text-sm">
              {locale === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-1">2000+</div>
            <p className="text-white/60 text-sm">
              {locale === 'ar' ? 'تقييم' : 'Reviews'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-1">98%</div>
            <p className="text-white/60 text-sm">
              {locale === 'ar' ? 'نسبة الرضا' : 'Satisfaction'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

