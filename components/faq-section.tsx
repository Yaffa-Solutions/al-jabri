'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FAQItem {
  id: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    questionEn: 'What are the check-in and check-out times?',
    questionAr: 'ما هي أوقات تسجيل الوصول والمغادرة؟',
    answerEn: 'Standard check-in time is 3:00 PM and check-out time is 12:00 PM. Early check-in and late check-out are available upon request and subject to availability.',
    answerAr: 'وقت تسجيل الوصول القياسي هو 3:00 مساءً ووقت تسجيل المغادرة هو 12:00 ظهرًا. تسجيل الوصول المبكر والمغادرة المتأخرة متاحة عند الطلب وحسب التوافر.',
  },
  {
    id: '2',
    questionEn: 'What payment methods do you accept?',
    questionAr: 'ما هي طرق الدفع المقبولة؟',
    answerEn: 'We accept major credit cards (Visa, MasterCard), Mada cards, bank transfers, and Apple Pay. Cash payments are also accepted at the hotel.',
    answerAr: 'نقبل بطاقات الائتمان الرئيسية (فيزا، ماستركارد)، بطاقات مدى، التحويلات البنكية، و Apple Pay. الدفع النقدي متاح أيضًا في الفندق.',
  },
  {
    id: '3',
    questionEn: 'Is there free cancellation?',
    questionAr: 'هل يوجد إلغاء مجاني؟',
    answerEn: 'Yes, most of our bookings offer free cancellation up to 48 hours before check-in. Special rates and peak season bookings may have different cancellation policies.',
    answerAr: 'نعم، معظم حجوزاتنا توفر إلغاء مجاني حتى 48 ساعة قبل تسجيل الوصول. الأسعار الخاصة وحجوزات المواسم قد تخضع لسياسات إلغاء مختلفة.',
  },
  {
    id: '4',
    questionEn: 'Do you offer airport transfers?',
    questionAr: 'هل توفرون خدمة التوصيل من وإلى المطار؟',
    answerEn: 'Yes, we offer complimentary airport transfers for bookings of 3 nights or more. For shorter stays, airport transfer can be arranged for an additional fee.',
    answerAr: 'نعم، نوفر خدمة التوصيل المجانية من وإلى المطار للحجوزات من 3 ليالٍ أو أكثر. للإقامات الأقصر، يمكن ترتيب التوصيل برسوم إضافية.',
  },
  {
    id: '5',
    questionEn: 'Are pets allowed in the hotel?',
    questionAr: 'هل يُسمح بالحيوانات الأليفة في الفندق؟',
    answerEn: 'Unfortunately, pets are not allowed in our hotels with the exception of service animals. Please contact us if you have special requirements.',
    answerAr: 'للأسف، لا يُسمح بالحيوانات الأليفة في فنادقنا باستثناء حيوانات الخدمة. يرجى التواصل معنا إذا كانت لديك متطلبات خاصة.',
  },
  {
    id: '6',
    questionEn: 'What amenities are included in the room?',
    questionAr: 'ما هي المرافق المتوفرة في الغرفة؟',
    answerEn: 'All rooms include free Wi-Fi, flat-screen TV, mini-fridge, safe, air conditioning, and premium toiletries. Upgraded rooms may include additional amenities like Nespresso machines.',
    answerAr: 'جميع الغرف تشمل واي فاي مجاني، تلفاز شاشة مسطحة، ثلاجة صغيرة، خزنة، تكييف، ومستلزمات العناية الشخصية الفاخرة. الغرف المطورة قد تشمل مرافق إضافية مثل ماكينات نيسبريسو.',
  },
];

export function FAQSection() {
  const { locale } = useI18n();
  const [openId, setOpenId] = useState<string | null>('1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            {locale === 'ar' ? 'الأسئلة المتكررة' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-lg text-navy/60 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'إجابات على الأسئلة الأكثر شيوعًا من ضيوفنا'
              : 'Answers to the most common questions from our guests'}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-md overflow-hidden opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-6 text-start hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-navy pe-4">
                  {locale === 'ar' ? faq.questionAr : faq.questionEn}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-navy/70 leading-relaxed">
                      {locale === 'ar' ? faq.answerAr : faq.answerEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-navy rounded-lg p-8">
          <MessageCircle className="w-12 h-12 text-gold mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {locale === 'ar' ? 'لم تجد إجابتك؟' : "Didn't find your answer?"}
          </h3>
          <p className="text-white/60 mb-6">
            {locale === 'ar'
              ? 'فريق الدعم لدينا متاح على مدار الساعة للإجابة على استفساراتك'
              : 'Our support team is available 24/7 to answer your questions'}
          </p>
          <Link href="/contact">
            <Button className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 rounded-sm">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;

