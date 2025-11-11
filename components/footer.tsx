"use client"

import type React from "react"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Building2, Facebook, Twitter, Instagram, Linkedin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function Footer() {
  const t = useTranslations("footer")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email address",
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
        toast.success("Subscribed!", {
          description: "Thank you for subscribing to our newsletter",
        })
        setEmail("")
      } else {
        toast.error("Subscription failed", {
          description: data.error || "Please try again",
        })
      }
    } catch (error) {
      console.error("[v0] Newsletter subscription error:", error)
      toast.error("Connection error", {
        description: "Please check your internet connection",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-[#324557] text-[#F7F4F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-[#B99B75]" />
              <span className="text-xl font-bold">Hotels Management</span>
            </div>
            <p className="text-[#CEB89E] text-sm mb-4">{t("description")}</p>
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#B99B75]">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/secrets" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  {t("perfectStay")}
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  {t("blogs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#B99B75]">{t("support")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  {t("help")}
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  {t("blogs")}
                </Link>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#B99B75]">{t("newsletter")}</h3>
            <p className="text-[#CEB89E] text-sm mb-4">{t("newsletterText")}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#48647E] border-[#5F83A4] text-white placeholder:text-[#CEB89E]"
                required
              />
              <Button
                type="submit"
                className="bg-[#B99B75] hover:bg-[#CEB89E] text-[#324557] whitespace-nowrap"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("subscribe")}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#48647E] pt-8 text-center text-sm text-[#CEB89E]">
          <p>
            &copy; {new Date().getFullYear()} Hotels Management. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
