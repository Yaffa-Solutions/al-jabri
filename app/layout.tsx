import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import './globals.css';
import { I18nProvider } from '@/lib/i18n-context';
import { Providers } from './providers';

const geist = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'منازلي الجابر | Al-Jabri Hotels - Luxury Hospitality in Saudi Arabia',
  description:
    'Specialized company in operating and managing luxury hotels in Saudi Arabia - شركة متخصصة في تشغيل وإدارة الفنادق الفاخرة في المملكة العربية السعودية',
  generator: 'Next.js',
  keywords: ['hotels', 'Saudi Arabia', 'luxury', 'hospitality', 'فنادق', 'المملكة العربية السعودية', 'ضيافة'],
  authors: [{ name: 'Al-Jabri Hotels' }],
  openGraph: {
    title: 'منازلي الجابر | Al-Jabri Hotels',
    description: 'Experience world-class hospitality in Saudi Arabia\'s finest hotels',
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preload Arabic Font */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <I18nProvider>
            {children}
            <Toaster position="top-right" richColors />
          </I18nProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
