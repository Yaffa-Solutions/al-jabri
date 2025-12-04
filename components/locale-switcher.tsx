'use client'

import { useI18n } from '@/lib/i18n-context'
import { Languages } from 'lucide-react'

export default function LocaleSwitcher() {
  const { locale, setLocale } = useI18n()

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en')
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
    >
      <Languages className="w-4 h-4" />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  )
}
