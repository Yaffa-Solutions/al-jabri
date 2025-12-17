"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Loader2, Phone, Mail, MapPin, Send, ArrowUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n-context"
import Image from "next/image"
import logo from '../public/logo-removebg-preview.png'

export function Footer() {
  const { t, locale } = useI18n()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error(locale === 'ar' ? "البريد الإلكتروني مطلوب" : "Email required", {
        description: locale === 'ar' ? "يرجى إدخال بريدك الإلكتروني" : "Please enter your email address",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(locale === 'ar' ? "تم الاشتراك!" : "Subscribed!", {
          description: locale === 'ar' ? "شكراً لاشتراكك في نشرتنا الإخبارية" : "Thank you for subscribing to our newsletter",
        })
        setEmail("")
      } else {
        toast.error(locale === 'ar' ? "فشل الاشتراك" : "Subscription failed", {
          description: data.error || (locale === 'ar' ? "يرجى المحاولة مرة أخرى" : "Please try again"),
        })
      }
    } catch (error) {
      console.error("[v0] Newsletter subscription error:", error)
      toast.error(locale === 'ar' ? "خطأ في الاتصال" : "Connection error", {
        description: locale === 'ar' ? "يرجى التحقق من اتصالك بالإنترنت" : "Please check your internet connection",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/booking", label: locale === 'ar' ? 'فنادقنا' : 'Our Hotels' },
    { href: "/secrets", label: t("footer.perfectStay") },
    { href: "/blogs", label: t("nav.blogs") },
    { href: "/contact", label: t("footer.contact") },
  ]

  const legalLinks = [
    { href: "#", label: t("footer.privacyPolicy") },
    { href: "#", label: t("footer.termsOfService") },
    { href: "#", label: locale === 'ar' ? 'سياسة الإلغاء' : 'Cancellation Policy' },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  return (
    <footer className="relative bg-navy text-white overflow-hidden">
      {/* Top Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      {/* Newsletter Section */}
      <div className="relative bg-navy-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-start">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {t("footer.newsletter")}
              </h3>
              <p className="text-white/60 max-w-md">
                {t("footer.newsletter.desc")}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder={t("footer.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-80 h-12 bg-navy border-white/20 text-white placeholder:text-white/40 focus:border-gold rounded-sm"
                  required
                />
                <Button
                  type="submit"
                  className="h-12 bg-gold hover:bg-gold-light text-navy font-semibold px-8 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 me-2" />
                      {t("footer.subscribe")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <Image src={logo} alt="Company Logo" width={80} height={80} className="transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              {t('about.description').slice(0, 150)}...
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold" />
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors duration-300 flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/30 group-hover:bg-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-bold text-gold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold" />
              {t("footer.support")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-white/60 hover:text-gold transition-colors duration-300 flex items-center gap-2 group text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/30 group-hover:bg-gold transition-colors" />
                  {t("footer.helpCenter")}
                </Link>
              </li>
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors duration-300 flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/30 group-hover:bg-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold" />
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+966000000000" className="flex items-start gap-3 text-white/60 hover:text-gold transition-colors group">
                  <Phone className="w-5 h-5 mt-0.5 text-gold" />
                  <span className="text-sm">+966 00 000 0000</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@aljabri.com" className="flex items-start gap-3 text-white/60 hover:text-gold transition-colors group">
                  <Mail className="w-5 h-5 mt-0.5 text-gold" />
                  <span className="text-sm">info@aljabri.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60">
                  <MapPin className="w-5 h-5 mt-0.5 text-gold flex-shrink-0" />
                  <span className="text-sm">
                    {locale === 'ar' 
                      ? 'الرياض، المملكة العربية السعودية'
                      : 'Riyadh, Saudi Arabia'
                    }
                  </span>
                </div>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-8">
              <p className="text-xs text-white/40 mb-3">
                {locale === 'ar' ? 'طرق الدفع المقبولة' : 'Accepted Payment Methods'}
              </p>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white/5 rounded text-xs font-medium text-white/60">VISA</div>
                <div className="px-3 py-1.5 bg-white/5 rounded text-xs font-medium text-white/60">MasterCard</div>
                <div className="px-3 py-1.5 bg-white/5 rounded text-xs font-medium text-white/60">Mada</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40 text-center md:text-start">
              &copy; {new Date().getFullYear()} {t("nav.companyName")}. {t("footer.rights")}
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-sm group"
            >
              {locale === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button (Fixed) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 rtl:right-auto rtl:left-8 z-50 w-12 h-12 bg-gold hover:bg-gold-light text-navy rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </footer>
  )
}

export default Footer
