"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

export function HeroSection() {
  const t = useTranslations("hero")

  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-[#324557] via-[#48647E] to-[#5F83A4] text-white">
      <div className="absolute inset-0 bg-[url('/luxury-hotel-exterior-architecture.jpg')] bg-cover bg-center opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <Building2 className="w-12 h-12 text-[#B99B75]" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">{t("title")}</h1>

        <p className="text-lg sm:text-xl md:text-2xl text-[#E3D6C7] mb-8 max-w-3xl mx-auto text-pretty">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/booking">
            <Button size="lg" className="bg-[#B99B75] hover:bg-[#CEB89E] text-[#324557] font-semibold">
              {t("bookNow")}
            </Button>
          </Link>
          <Link href="/secrets">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              {t("learnMore")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
