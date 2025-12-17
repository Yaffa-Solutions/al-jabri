'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n-context';
import Image from 'next/image';
import logo from '../public/logo-removebg-preview.png';

export function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for transparent -> solid navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
  };

  const isActive = (path: string) => pathname === path;
  const isHomePage = pathname === '/';

  return (
    <header 
      className={`${isHomePage ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage ? 'bg-navy shadow-lg' : 'bg-navy/80 backdrop-blur-sm'
      }`}
    >
      {/* Top bar with contact info - only on desktop */}
      <div 
        className={`hidden lg:block border-b border-white/10 transition-all duration-300 ${
          scrolled ? 'h-0 overflow-hidden opacity-0 py-0' : 'py-2 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6 text-white/80">
            <a href="tel:+966000000000" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="w-4 h-4" />
              <span>+966 00 000 0000</span>
            </a>
            <span className="text-white/30">|</span>
            <a href="mailto:info@aljabri.com" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="w-4 h-4" />
              <span>info@aljabri.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={switchLanguage}
              className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors"
            >
              <Globe className="w-4 h-4" />
              {locale === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={logo}
                  alt="Company Logo"
                  width={60}
                  height={60}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg lg:text-xl font-bold text-white tracking-wide">
                  {t('nav.companyName')}
                </span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gold transition-all duration-300" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/about', label: t('nav.about') },
                { path: '/booking', label: t('hotels.featured') },
                { path: '/secrets', label: t('footer.perfectStay') },
                { path: '/blogs', label: t('nav.blogs') },
                { path: '/contact', label: t('nav.contact') },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                    isActive(item.path)
                      ? 'text-gold'
                      : 'text-white/90 hover:text-gold'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold transition-all duration-300 ${
                      isActive(item.path) ? 'w-1/2' : 'w-0 group-hover:w-1/2'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* CTA Button & Language (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/booking">
                <Button className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold/20">
                  {t('nav.bookNow')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-navy border-t border-white/10 px-4 py-6 space-y-4">
            {[
              { path: '/', label: t('nav.home') },
              { path: '/about', label: t('nav.about') },
              { path: '/booking', label: t('hotels.featured') },
              { path: '/secrets', label: t('footer.perfectStay') },
              { path: '/blogs', label: t('nav.blogs') },
              { path: '/contact', label: t('nav.contact') },
              { path: '/login', label: t('nav.login') },
            ].map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-3 px-4 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gold/10 text-gold border-s-4 border-gold'
                    : 'text-white/90 hover:bg-white/5 hover:text-gold'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Language & CTA */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <button
                onClick={() => {
                  switchLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white/80 hover:text-gold transition-colors"
              >
                <Globe className="w-5 h-5" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
              <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-3 rounded-sm">
                  {t('nav.bookNow')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
