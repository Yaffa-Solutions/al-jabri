"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n-context"

export function ContactForm() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          subject: `Contact form message from ${formData.name}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t('contact.success'), {
          description: t('contact.successDesc'),
        })

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      } else {
        toast.error(t('contact.error'), {
          description: data.error || t('contact.errorDesc'),
        })
      }
    } catch (error) {
      console.error("[v0] Contact form error:", error)
      toast.error(t('contact.connectionError'), {
        description: t('contact.connectionErrorDesc'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-[#F7F4F0] via-[#EDE5DB] to-[#E3D6C7] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#B99B75] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#CEB89E] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#324557] leading-tight">
              {t('contact.title')}
            </h1>
          </div>

          <p className="text-base md:text-lg text-[#5F83A4] max-w-2xl mx-auto leading-relaxed font-light px-4">
            {t('contact.subtitle')}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B99B75]" />
            <div className="w-2 h-2 rounded-full bg-[#B99B75]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B99B75]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="group bg-white/80 backdrop-blur-sm border-[#E3D6C7] hover:border-[#B99B75] hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Card Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F7F4F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="relative space-y-2">
                <CardTitle className="text-2xl text-[#324557] font-bold">
                  {t('contact.info')}
                </CardTitle>
                <CardDescription className="text-[#5F83A4]">
                  {t('contact.infoDesc')}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-[#F7F4F0] to-white hover:shadow-md transition-all duration-300 group/item">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-xl blur-md opacity-0 group-hover/item:opacity-30 transition-opacity" />
                    <div className="relative p-3 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-xl shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#324557] mb-1">{t('contact.email')}</h3>
                    <p className="text-[#5F83A4] text-sm break-all">info@hotelsmanagement.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-[#F7F4F0] to-white hover:shadow-md transition-all duration-300 group/item">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-xl blur-md opacity-0 group-hover/item:opacity-30 transition-opacity" />
                    <div className="relative p-3 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-xl shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#324557] mb-1">{t('contact.phone')}</h3>
                    <p className="text-[#5F83A4] text-sm">+966 XX XXX XXXX</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-[#F7F4F0] to-white hover:shadow-md transition-all duration-300 group/item">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-xl blur-md opacity-0 group-hover/item:opacity-30 transition-opacity" />
                    <div className="relative p-3 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-xl shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#324557] mb-1">{t('contact.location')}</h3>
                    <p className="text-[#5F83A4] text-sm">{t('contact.locationValue')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="group bg-white/80 backdrop-blur-sm border-[#E3D6C7] hover:border-[#B99B75] hover:shadow-2xl transition-all duration-300 overflow-hidden">
            {/* Card Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F7F4F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative space-y-2">
              <CardTitle className="text-2xl text-[#324557] font-bold">
                {t('contact.formTitle')}
              </CardTitle>
              <CardDescription className="text-[#5F83A4]">
                {t('contact.formDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#324557] font-semibold">
                    {t('contact.name')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t('contact.namePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75] focus:ring-[#B99B75] transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#324557] font-semibold">
                    {t('contact.email')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('contact.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75] focus:ring-[#B99B75] transition-colors"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#324557] font-semibold">
                    {t('contact.phone')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t('contact.phonePlaceholder')}
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75] focus:ring-[#B99B75] transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#324557] font-semibold">
                    {t('contact.message')}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('contact.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75] focus:ring-[#B99B75] min-h-[140px] transition-colors resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#B99B75] to-[#CEB89E] hover:from-[#CEB89E] hover:to-[#B99B75] text-white font-semibold py-6 text-base rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('contact.sending')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {t('contact.send')}
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
