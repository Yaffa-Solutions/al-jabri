'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n-context';
import Image from 'next/image';
import logo from '../public/logo-removebg-preview.png'; 
export function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#324557] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {/* replace the logo to read it from bublic logo.png */}
            <Image src={logo} alt="Company Logo" width={80} height={80} />
            <span className="text-xl font-bold">{t('nav.companyName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/about"
              className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors"
            >
              {t('nav.about')}
            </Link>
            <Link
              href="/secrets"
              className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors"
            >
              {t('footer.perfectStay')}
            </Link>
            <Link
              href="/blogs"
              className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors"
            >
              {t('nav.blogs')}
            </Link>
            <Link
              href="/contact"
              className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors"
            >
              {t('nav.contact')}
            </Link>
            <Link
              href="/login"
              className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={switchLanguage}
              className="text-[#E3D6C7] hover:text-[#B99B75] hover:bg-[#48647E] gap-2"
            >
              <Globe className="w-4 h-4" />
              {locale === 'en' ? 'العربية' : 'English'}
            </Button>
            <Link href="/booking">
              <Button className="bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold">
                {t('nav.bookNow')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-white hover:bg-[#48647E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
                {t('nav.home')}
              </Link>
              <Link
                href="/about"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/secrets"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('footer.perfectStay')}{' '}
              </Link>
              <Link
                href="/blogs"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.blogs')}
              </Link>
              <Link
                href="/contact"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link
                href="/login"
                className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  switchLanguage();
                  setMobileMenuOpen(false);
                }}
                className="text-[#E3D6C7] hover:text-[#B99B75] hover:bg-[#48647E] gap-2 justify-start"
              >
                <Globe className="w-4 h-4" />
                {locale === 'en' ? 'العربية' : 'English'}
              </Button>
              <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold">
                  {t('nav.bookNow')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
