"use client"

import { useI18n } from "@/lib/i18n-context"

export function AboutUs() {
  const { t } = useI18n()

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative mb-12">
          <div className="bg-[#324557] rounded-lg py-6 px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#B99B75]">
              {t("about.title")} | {t("about.subtitle")}
            </h2>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-12 h-0.5 bg-[#B99B75]"></div>
        </div>

        {/* Content Box */}
        <div className="border-2 border-[#B99B75]/30 rounded-3xl p-8 md:p-12 bg-background/50 relative">
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#324557]"></div>
            ))}
          </div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#B99B75]/30 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#B99B75]/30 rounded-br-lg"></div>

          {/* Arabic Text */}
          <div className="mb-8 text-right" dir="rtl">
            <p className="text-[#B99B75] text-lg md:text-xl leading-relaxed font-serif">{t("about.description.ar")}</p>
          </div>

          {/* Divider Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#B99B75]/30 to-transparent mb-8"></div>

          {/* English Text */}
          <div className="text-left">
            <p className="text-[#B99B75] text-lg md:text-xl leading-relaxed">{t("about.description")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
