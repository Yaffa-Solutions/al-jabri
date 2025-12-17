'use client';

import { useI18n } from '@/lib/i18n-context';
import { Target, Eye, Diamond, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function AboutUs() {
  const { t, locale } = useI18n();

  const valuesList = [
    { key: 'about.values.quality', icon: '✨' },
    { key: 'about.values.professionalism', icon: '🎯' },
    { key: 'about.values.flexibility', icon: '🔄' },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-cream/50 -skew-x-12 transform origin-top-right" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              {locale === 'ar' ? 'تعرف علينا' : 'About Us'}
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
            {t('about.title')}
          </h2>
          <p className="text-lg text-navy/70 max-w-3xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/luxury-hotel-lobby-modern-design.jpg"
                alt="Luxury Hotel"
                fill
                className="object-cover"
              />
              {/* Overlay with stats */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">10+</div>
                    <div className="text-sm text-white/70">
                      {locale === 'ar' ? 'سنوات خبرة' : 'Years'}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">15+</div>
                    <div className="text-sm text-white/70">
                      {locale === 'ar' ? 'فندق' : 'Hotels'}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">500+</div>
                    <div className="text-sm text-white/70">
                      {locale === 'ar' ? 'غرفة' : 'Rooms'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-4 border-gold rounded-lg -z-10" />
          </div>

          {/* Right Column - Mission & Vision Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mission Card */}
            <div className="bg-navy rounded-lg p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gold/5 rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gold rounded-lg">
                    <Target className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <span className="text-gold text-sm font-medium tracking-wider uppercase">
                      {locale === 'ar' ? 'مهمتنا' : 'Our Mission'}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t('about.mission.title')}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </div>
            </div>

            {/* Vision & Values Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vision Card */}
              <div className="bg-cream rounded-lg p-6 group hover:shadow-lg hover:bg-white transition-all duration-500 border border-transparent hover:border-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-navy/5 rounded-lg group-hover:bg-gold group-hover:text-navy text-navy transition-colors">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-navy/60 font-medium text-sm uppercase tracking-wider">
                    {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-navy mb-2">
                  {t('about.vision.title')}
                </h4>
                <p className="text-navy/60 text-sm leading-relaxed">
                  {t('about.vision.description')}
                </p>
              </div>

              {/* Values Card */}
              <div className="bg-gold rounded-lg p-6 text-navy relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1a2c44_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Diamond className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-wider">
                      {t('about.values.title')}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {valuesList.map((val, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold">{t(val.key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-start">
              <Link href="/about">
                <Button className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-6 rounded-sm group">
                  {locale === 'ar' ? 'اكتشف المزيد عنا' : 'Learn More About Us'}
                  <ArrowRight className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
