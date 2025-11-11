import type React from "react"
import { notFound } from "next/navigation"
import { getMessages } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "../globals.css"
import { routing } from "@/i18n/routing"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const titles = {
    en: "Hotels Management - إدارة الفنادق | KSA Hotel Operations",
    ar: "إدارة الفنادق - Hotels Management | عمليات الفنادق في المملكة",
  }

  const descriptions = {
    en: "Specialized company in operating and managing hotels in Saudi Arabia - شركة متخصصة في تشغيل وإدارة الفنادق في المملكة العربية السعودية",
    ar: "شركة متخصصة في تشغيل وإدارة الفنادق في المملكة العربية السعودية - Specialized company in operating and managing hotels in Saudi Arabia",
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    generator: "v0.app",
    icons: {
      icon: [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
      ],
      apple: "/apple-icon.png",
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client side
  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
