"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Award, Headphones } from "lucide-react"

export function Features() {
  const t = useTranslations("features")

  const features = [
    {
      icon: Shield,
      title: t("qualityService.title"),
      description: t("qualityService.description"),
    },
    {
      icon: Clock,
      title: t("expertTeam.title"),
      description: t("expertTeam.description"),
    },
    {
      icon: Award,
      title: t("modernFacilities.title"),
      description: t("modernFacilities.description"),
    },
    {
      icon: Headphones,
      title: t("support.title"),
      description: t("support.description"),
    },
  ]

  return (
    <section className="py-16 bg-[#E3D6C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#324557] mb-4">{t("title")}</h2>
          <p className="text-lg text-[#48647E] max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-card">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B99B75] mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-[#324557] mb-3">{feature.title}</h3>

                <p className="text-[#48647E] text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
