"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Menu, X, Globe, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const switchLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en"
    setLocale(newLocale)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#324557] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Building2 className="w-8 h-8 text-[#B99B75]" />
            <span className="text-xl font-bold">Hotels Management</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/about" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              {t("nav.about")}
            </Link>
            <Link href="/secrets" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              {t("nav.secrets")}
            </Link>
            <Link href="/blogs" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              {t("nav.blogs")}
            </Link>
            <Link href="/contact" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              {t("nav.contact")}
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#E3D6C7] hover:text-[#B99B75] hover:bg-[#48647E] gap-2"
                      >
                        <User className="w-4 h-4" />
                        {user.user_metadata?.first_name || user.email?.split("@")[0]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">{t("profile")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/booking">{t("myBookings")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/auth/login" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
                    {t("nav.login")}
                  </Link>
                )}
              </>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={switchLanguage}
              className="text-[#E3D6C7] hover:text-[#B99B75] hover:bg-[#48647E] gap-2"
            >
              <Globe className="w-4 h-4" />
              {locale === "en" ? "العربية" : "English"}
            </Button>
            <Link href="/booking">
              <Button className="bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold">{t("bookNow")}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-white hover:bg-[#48647E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#48647E]">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/about"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/secrets"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.secrets")}
              </Link>
              <Link
                href="/blogs"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.blogs")}
              </Link>
              <Link
                href="/contact"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.contact")}
              </Link>

              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("profile")}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors py-2 text-left"
                      >
                        {t("logout")}
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("nav.login")}
                    </Link>
                  )}
                </>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  switchLanguage()
                  setMobileMenuOpen(false)
                }}
                className="text-[#E3D6C7] hover:text-[#B99B75] hover:bg-[#48647E] gap-2 justify-start"
              >
                <Globe className="w-4 h-4" />
                {locale === "en" ? "العربية" : "English"}
              </Button>
              <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold">
                  {t("bookNow")}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
