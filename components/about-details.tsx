'use client';

import { useI18n } from '@/lib/i18n-context'; // Adjust path to your context
import { 
  Building2, 
  Users, 
  CalendarDays, 
  BedDouble, 
  Target, 
  Eye, 
  Diamond, 
  CheckCircle2,
  Quote
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AboutDetails() {
  const { t } = useI18n();

  // Calculated from PDF data: 5 Hotels listed, Total rooms approx 1900+, Est. 1420H (approx 25 years)
  const stats = [
    {
      icon: Building2,
      value: "5",
      label: t("stats.hotels"),
    },
    {
      icon: BedDouble,
      value: "1,900+",
      label: t("stats.rooms"),
    },
    {
      icon: CalendarDays,
      value: "25+",
      label: t("stats.years"),
    },
    {
      icon: Users,
      value: "150K+",
      label: t("stats.guests"), // Estimated figure
    },
  ];

  const valuesList = [
    'about.values.quality',
    'about.values.professionalism',
    'about.values.flexibility',
  ];

  return (
    <section className="py-20 px-4 bg-[#FDFBF7] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* --- SECTION 1: ABOUT US (Introduction) --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#B99B75]/10 rounded-full blur-3xl"></div>
             <h2 className="text-4xl md:text-5xl font-bold text-[#324557] font-serif mb-6 leading-tight relative z-10">
               {t('about.title')}
             </h2>
             <div className="w-20 h-1.5 bg-[#B99B75] rounded-full mb-8"></div>
             <div className="relative">
                <Quote className="absolute -top-6 -left-4 w-10 h-10 text-[#B99B75]/20" />
                <p className="text-gray-600 text-lg leading-loose font-medium">
                  {t('about.description')}
                </p>
             </div>
          </div>
          
          {/* Decorative Image Placeholder or Abstract Graphic */}
          <div className="relative h-full min-h-[300px] bg-[#324557] rounded-[2rem] p-8 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B99B75_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="text-center relative z-10">
                <span className="block text-[#B99B75] text-sm tracking-[0.3em] uppercase mb-2">{t('about.subtitle')}</span>
                <h3 className="text-3xl text-white font-serif">{t('nav.companyName')}</h3>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: MISSION & VISION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white border border-[#E3D6C7] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 bg-[#F7F4F0] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#B99B75] transition-colors">
                    <Eye className="w-7 h-7 text-[#324557] group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#324557] mb-4">{t('about.vision.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('about.vision.description')}</p>
            </div>

            {/* Mission Card (Highlighted) */}
            <div className="bg-[#324557] text-white rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B99B75]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Target className="w-7 h-7 text-[#B99B75]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#B99B75]">{t('about.mission.title')}</h3>
                <p className="text-gray-300 leading-relaxed">{t('about.mission.description')}</p>
            </div>
        </div>

        {/* --- SECTION 3: VALUES & STATS MIX --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Values Column */}
            <div className="lg:col-span-1 bg-white border border-[#E3D6C7] rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Diamond className="w-6 h-6 text-[#B99B75]" />
                    <h3 className="text-2xl font-bold text-[#324557]">{t('about.values.title')}</h3>
                </div>
                <div className="space-y-4">
                    {valuesList.map((valKey, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F4F0]">
                            <CheckCircle2 className="w-5 h-5 text-[#B99B75]" />
                            <span className="font-semibold text-[#324557]">{t(valKey)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid - Spans 2 Columns */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                    <Card key={index} className="bg-white border-0 shadow-md hover:-translate-y-1 transition-transform duration-300">
                        <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                            <div className="p-3 bg-[#324557]/5 rounded-full mb-3">
                                <Icon className="w-6 h-6 text-[#324557]" />
                            </div>
                            <h3 className="text-3xl font-bold text-[#B99B75] mb-1">{stat.value}</h3>
                            <p className="text-sm font-semibold text-[#5F83A4]">{stat.label}</p>
                        </CardContent>
                    </Card>
                    )
                })}
            </div>
        </div>

      </div>
    </section>
  )
}

export default AboutDetails;