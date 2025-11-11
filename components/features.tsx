"use client"

import { useI18n } from "@/lib/i18n-context"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Award, Headphones } from "lucide-react"

export function Features() {
  const { t } = useI18n()

  const features = [
    {
      icon: Shield,
      title: t("features.luxury"),
      description: t("features.luxury.desc"),
    },
    {
      icon: Clock,
      title: t("features.service"),
      description: t("features.service.desc"),
    },
    {
      icon: Award,
      title: t("features.locations"),
      description: t("features.locations.desc"),
    },
    {
      icon: Headphones,
      title: t("features.dining"),
      description: t("features.dining.desc"),
    },
  ]

  return (
    <section className="py-16 bg-[#E3D6C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#324557] mb-4">Why Choose Us</h2>
          <p className="text-lg text-[#48647E] max-w-2xl mx-auto">Excellence in every aspect of hospitality</p>
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

export default Features
