'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Star, Shield, Clock, Award, Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import Link from "next/link"

export function SecretsContent() {
  const { t } = useI18n()

  const secrets = [
    {
      icon: Star,
      titleKey: 'secrets.location.title',
      descKey: 'secrets.location.description',
      tips: [
        'secrets.location.tip1',
        'secrets.location.tip2',
        'secrets.location.tip3',
      ],
    },
    {
      icon: Shield,
      titleKey: 'secrets.cleanliness.title',
      descKey: 'secrets.cleanliness.description',
      tips: [
        'secrets.cleanliness.tip1',
        'secrets.cleanliness.tip2',
        'secrets.cleanliness.tip3',
      ],
    },
    {
      icon: Heart,
      titleKey: 'secrets.service.title',
      descKey: 'secrets.service.description',
      tips: [
        'secrets.service.tip1',
        'secrets.service.tip2',
        'secrets.service.tip3',
      ],
    },
    {
      icon: Clock,
      titleKey: 'secrets.flexibility.title',
      descKey: 'secrets.flexibility.description',
      tips: [
        'secrets.flexibility.tip1',
        'secrets.flexibility.tip2',
        'secrets.flexibility.tip3',
      ],
    },
    {
      icon: Award,
      titleKey: 'secrets.amenities.title',
      descKey: 'secrets.amenities.description',
      tips: [
        'secrets.amenities.tip1',
        'secrets.amenities.tip2',
        'secrets.amenities.tip3',
      ],
    },
    {
      icon: Sparkles,
      titleKey: 'secrets.attention.title',
      descKey: 'secrets.attention.description',
      tips: [
        'secrets.attention.tip1',
        'secrets.attention.tip2',
        'secrets.attention.tip3',
      ],
    },
  ]

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-[#F7F4F0] via-[#EDE5DB] to-[#E3D6C7] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#B99B75] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#CEB89E] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-full blur-xl opacity-50" />
              <div className="relative p-5 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-full shadow-xl">
                <Sparkles className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#324557] leading-tight">
              {t('secrets.title')}
            </h1>
          </div>

          <p className="text-base md:text-lg text-[#5F83A4] max-w-3xl mx-auto leading-relaxed font-light px-4">
            {t('secrets.subtitle')}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B99B75]" />
            <div className="w-2 h-2 rounded-full bg-[#B99B75]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B99B75]" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {secrets.map((secret, index) => {
            const Icon = secret.icon
            return (
              <Card
                key={index}
                className="group bg-white/80 backdrop-blur-sm border-[#E3D6C7] hover:border-[#B99B75] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Card Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F7F4F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="relative space-y-4 pb-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                      <div className="relative p-4 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <CardTitle className="text-xl text-[#324557] text-center font-bold leading-snug">
                    {t(secret.titleKey)}
                  </CardTitle>

                  <CardDescription className="text-[#5F83A4] text-center leading-relaxed text-sm">
                    {t(secret.descKey)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative pt-4 border-t border-[#E3D6C7]">
                  <ul className="space-y-3">
                    {secret.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3 text-sm text-[#5F83A4] group/item">
                        <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-gradient-to-br from-[#B99B75] to-[#CEB89E] group-hover/item:scale-150 transition-transform" />
                        <span className="leading-relaxed">{t(tip)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="relative mt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#324557] via-[#48647E] to-[#324557] rounded-3xl blur-sm opacity-50" />
          <div className="relative bg-gradient-to-r from-[#324557] via-[#3C5369] to-[#48647E] rounded-3xl p-10 md:p-16 text-center shadow-2xl overflow-hidden">
            {/* Decorative Patterns */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {t('secrets.cta.title')}
              </h3>

              <p className="text-[#E3D6C7] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                {t('secrets.cta.description')}
              </p>

              <div className="pt-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B99B75] to-[#CEB89E] hover:from-[#CEB89E] hover:to-[#B99B75] text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform"
                >
                  <span>{t('secrets.cta.button')}</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecretsContent
