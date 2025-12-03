'use client';

import { useI18n } from '@/lib/i18n-context'; // Adjust based on your actual path
import { Diamond, Eye, Target, Check, Quote } from 'lucide-react';

export function AboutUs() {
  const { t } = useI18n();

  const valuesList = [
    'about.values.quality',
    'about.values.professionalism',
    'about.values.flexibility',
  ];

  return (
    <section className="py-24 px-4 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section: Clean & Centered --- */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#324557] font-serif mb-6">
            {t('about.title')}
          </h2>
          <div className="relative inline-block">
             <Quote className="absolute -top-4 -left-6 w-8 h-8 text-[#B99B75] opacity-30 -scale-x-100" />
             <p className="text-xl text-gray-600 leading-relaxed font-medium">
               {t('about.description')}
             </p>
             <Quote className="absolute -bottom-4 -right-6 w-8 h-8 text-[#B99B75] opacity-30" />
          </div>
        </div>

        {/* --- The Mosaic Grid (Bento Style) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. MISSION (The Hero Box) - Spans 7 columns */}
          <div className="lg:col-span-7 bg-[#324557] rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B99B75] opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <Target className="absolute bottom-[-20px] right-[-20px] w-64 h-64 text-white opacity-5 rotate-12" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#B99B75] rounded-xl text-white">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[#B99B75] font-bold tracking-widest text-sm uppercase">Our Mission</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white font-serif mb-6 leading-tight">
                {t('about.mission.title')}
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                {t('about.mission.description')}
              </p>
            </div>

            {/* Decorative Button/Link (Optional) */}
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center text-white/60 text-sm font-mono">
               01 — THE GOAL
            </div>
          </div>

          {/* Right Column Container - Spans 5 columns */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 2. VISION (Top Right) */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex-1 relative overflow-hidden group hover:border-[#B99B75]/50 transition-colors duration-300">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#B99B75]/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#324557]/5 rounded-lg text-[#324557] group-hover:bg-[#324557] group-hover:text-white transition-colors">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Our Vision</span>
               </div>
               
               <h3 className="text-xl font-bold text-[#324557] mb-3 font-serif">
                 {t('about.vision.title')}
               </h3>
               <p className="text-gray-600 leading-relaxed">
                 {t('about.vision.description')}
               </p>
            </div>

            {/* 3. VALUES (Bottom Right) */}
            <div className="bg-[#B99B75] rounded-[2rem] p-8 text-white relative overflow-hidden flex-1">
               {/* Pattern */}
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
               
               <div className="relative z-10 h-full flex flex-col">
                 <div className="flex items-center gap-3 mb-6">
                    <Diamond className="w-6 h-6" />
                    <h3 className="text-xl font-bold font-serif">{t('about.values.title')}</h3>
                 </div>

                 <ul className="space-y-4 my-auto">
                   {valuesList.map((val, idx) => (
                     <li key={idx} className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                         <Check className="w-3.5 h-3.5" />
                       </div>
                       <span className="font-semibold text-lg">{t(val)}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutUs;