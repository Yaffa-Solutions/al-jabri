'use client';

import { useI18n } from '@/lib/i18n-context';
import { CreditCard, Shield, Clock, CheckCircle } from 'lucide-react';

const paymentMethods = [
  { name: 'Visa', logo: '/visa-logo.svg', color: '#1A1F71' },
  { name: 'MasterCard', logo: '/mastercard-logo.svg', color: '#EB001B' },
  { name: 'Mada', logo: '/mada-logo.svg', color: '#004C9C' },
  { name: 'Apple Pay', logo: '/apple-pay-logo.svg', color: '#000000' },
];

const securityFeatures = [
  {
    icon: Shield,
    titleEn: 'Secure Payments',
    titleAr: 'دفع آمن',
    descEn: 'SSL encrypted transactions',
    descAr: 'معاملات مشفرة بتقنية SSL',
  },
  {
    icon: CreditCard,
    titleEn: 'Multiple Options',
    titleAr: 'خيارات متعددة',
    descEn: 'Pay your way',
    descAr: 'ادفع بطريقتك',
  },
  {
    icon: Clock,
    titleEn: 'Instant Confirmation',
    titleAr: 'تأكيد فوري',
    descEn: 'Book and get confirmed instantly',
    descAr: 'احجز واحصل على التأكيد فورًا',
  },
  {
    icon: CheckCircle,
    titleEn: 'PCI Compliant',
    titleAr: 'متوافق مع PCI',
    descEn: 'Highest security standards',
    descAr: 'أعلى معايير الأمان',
  },
];

export function PaymentPartners() {
  const { locale } = useI18n();

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Security Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy/5 text-navy mb-3 group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-navy text-sm mb-1">
                  {locale === 'ar' ? feature.titleAr : feature.titleEn}
                </h4>
                <p className="text-navy/50 text-xs">
                  {locale === 'ar' ? feature.descAr : feature.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-100 pt-8">
          <p className="text-center text-sm text-navy/50 mb-6">
            {locale === 'ar' ? 'طرق الدفع المقبولة' : 'Accepted Payment Methods'}
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                title={method.name}
              >
                <span className="font-bold text-lg" style={{ color: method.color }}>
                  {method.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-xs text-navy/40">
            {locale === 'ar'
              ? 'جميع المعاملات محمية ومشفرة. بياناتك آمنة معنا.'
              : 'All transactions are protected and encrypted. Your data is safe with us.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default PaymentPartners;

