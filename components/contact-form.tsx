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

export function ContactForm() {
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
        toast.success("Message sent!", {
          description: "We will get back to you as soon as possible.",
        })

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      } else {
        toast.error("Failed to send message", {
          description: data.error || "Please try again later",
        })
      }
    } catch (error) {
      console.error("[v0] Contact form error:", error)
      toast.error("Connection error", {
        description: "Please check your internet connection and try again",
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
    <section className="py-20 px-4 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#324557] mb-4">Get In Touch</h1>
          <h2 className="text-3xl font-bold text-[#B99B75] mb-4" dir="rtl">
            تواصل معنا
          </h2>
          <p className="text-lg text-[#5F83A4] max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white border-[#E3D6C7]">
              <CardHeader>
                <CardTitle className="text-[#324557]">Contact Information</CardTitle>
                <CardDescription>Reach out to us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#B99B75] rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#324557]">Email</h3>
                    <p className="text-[#5F83A4]">info@hotelsmanagement.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#B99B75] rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#324557]">Phone</h3>
                    <p className="text-[#5F83A4]">+966 XX XXX XXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#B99B75] rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#324557]">Location</h3>
                    <p className="text-[#5F83A4]">Riyadh, Saudi Arabia</p>
                    <p className="text-[#B99B75] text-sm" dir="rtl">
                      الرياض، المملكة العربية السعودية
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-white border-[#E3D6C7]">
            <CardHeader>
              <CardTitle className="text-[#324557]">Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#324557]">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#324557]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#324557]">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+966 XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#324557]">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    className="border-[#86A1BA] focus:border-[#B99B75] min-h-[120px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
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
