'use client';

import { useI18n } from '@/lib/i18n-context';
import { Diamond, Eye, Quote, Target } from 'lucide-react'; // Make sure to install lucide-react if you haven't

export function AboutUs() {
  const { t } = useI18n();
  const valuesList = [
    'about.values.quality',
    'about.values.professionalism',
    'about.values.flexibility',
  ];
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-[#FDFBF7]">
      {/* Background Decorative Elements (Subtle) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#B99B75]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#324557]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Modern Header - Clean & Elegant */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#B99B75] font-bold tracking-[0.2em] text-sm uppercase">
            {t('about.subtitle')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#324557] font-serif">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-[#B99B75] mx-auto rounded-full mt-4"></div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 md:p-12 border border-[#B99B75]/20">
          <div className="relative">
            <Quote className="absolute -top-6 -left-4  h-10 text-[#B99B75]/20" />
            <p className="text-gray-600 text-lg leading-loose font-medium">
              {t('about.description')}
            </p>
          </div>

          {/* Bottom Decoration */}
          <div className="mt-12 flex justify-center gap-2 opacity-40">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full bg-[#324557] ${
                  i === 1 ? 'w-8' : 'w-1.5'
                }`}
              ></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {/* Card 1: Our Vision */}
          <div className="bg-white/60 hover:bg-white transition-all duration-300 rounded-2xl p-8 shadow-lg hover:shadow-xl border-t-4 border-[#B99B75] group">
            <div className="bg-[#324557]/5 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B99B75] transition-colors duration-300">
              <Eye className="w-7 h-7 text-[#324557] group-hover:text-white" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <h3 className="text-2xl font-bold text-[#324557]">
                  {t('about.vision.title')}
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600 text-xl leading-relaxed">
                  {t('about.vision.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Our Mission */}
          <div className="bg-[#324557] text-white rounded-2xl p-8 shadow-xl transform md:-translate-y-4 border-t-4 border-[#B99B75] relative overflow-hidden">
            {/* Subtle pattern background for the middle card */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Quote className="w-24 h-24" />
            </div>

            <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-[#B99B75]" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-baseline border-b border-white/20 pb-2">
                <h3 className="text-2xl font-bold">{t('about.mission.title')}</h3>
              </div>

              <div className="space-y-3">
                <p className="text-gray-300 text-xl leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Our Values */}
          <div className="bg-white/60 hover:bg-white transition-all duration-300 rounded-2xl p-8 shadow-lg hover:shadow-xl border-t-4 border-[#B99B75] group">
            <div className="bg-[#324557]/5 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B99B75] transition-colors duration-300">
              <Diamond className="w-7 h-7 text-[#324557] group-hover:text-white" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <h3 className="text-2xl font-bold text-[#324557]">
                  {t('about.values.title')}
                </h3>
              </div>

              <ul className="space-y-3 pt-2">
                {valuesList.map((val, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between group/item"
                  >
                    <span className="text-gray-600 text-xl font-medium group-hover/item:text-[#324557] transition-colors">
                      {t(val)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
