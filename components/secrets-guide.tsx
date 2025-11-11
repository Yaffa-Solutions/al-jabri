import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Star, Shield, Clock, Award, Heart } from "lucide-react"

export function SecretsGuide() {
  const secrets = [
    {
      icon: Star,
      title: "Choose the Right Location",
      titleAr: "اختر الموقع المناسب",
      description:
        "The location sets the tone for your entire stay. Select a hotel that provides easy access to attractions while offering a peaceful retreat.",
      tips: [
        "Research neighborhood safety and accessibility",
        "Consider proximity to transportation hubs",
        "Check nearby dining and entertainment options",
      ],
    },
    {
      icon: Shield,
      title: "Prioritize Cleanliness & Safety",
      titleAr: "أعط الأولوية للنظافة والسلامة",
      description: "A truly perfect stay begins with impeccable hygiene standards and comprehensive safety measures.",
      tips: [
        "Look for hotels with stringent cleaning protocols",
        "Verify security measures and emergency procedures",
        "Read recent guest reviews about cleanliness",
      ],
    },
    {
      icon: Heart,
      title: "Seek Personalized Service",
      titleAr: "ابحث عن خدمة شخصية",
      description: "Exceptional hospitality transforms a good stay into an unforgettable experience.",
      tips: [
        "Choose hotels known for attentive staff",
        "Look for personalized welcome amenities",
        "Consider properties with concierge services",
      ],
    },
    {
      icon: Clock,
      title: "Flexible Check-in & Check-out",
      titleAr: "مرونة الدخول والخروج",
      description: "Travel plans change. Hotels offering flexibility show they value your convenience.",
      tips: [
        "Inquire about early check-in options",
        "Ask about late checkout availability",
        "Look for 24-hour reception services",
      ],
    },
    {
      icon: Award,
      title: "Quality Amenities Matter",
      titleAr: "جودة المرافق مهمة",
      description: "The right amenities can elevate your stay from ordinary to extraordinary.",
      tips: [
        "Verify room amenities match your needs",
        "Check for fitness center and pool facilities",
        "Look for complimentary services like breakfast",
      ],
    },
    {
      icon: Sparkles,
      title: "Attention to Detail",
      titleAr: "الاهتمام بالتفاصيل",
      description: "Small touches make the biggest difference in creating memorable stays.",
      tips: [
        "Look for thoughtful room design",
        "Notice welcome gestures and special touches",
        "Consider hotels with unique character",
      ],
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#B99B75] rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#324557] mb-4">
            Discover The Secrets Of The Perfect Stay
          </h1>
          <h2 className="text-3xl font-bold text-[#B99B75] mb-4" dir="rtl">
            اكتشف أسرار الإقامة المثالية
          </h2>
          <p className="text-lg text-[#5F83A4] max-w-3xl mx-auto leading-relaxed">
            After decades of hospitality excellence, we're sharing the insider knowledge that separates an ordinary
            hotel stay from an extraordinary experience. These are the principles we follow in every property we manage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secrets.map((secret, index) => {
            const Icon = secret.icon
            return (
              <Card
                key={index}
                className="bg-white border-[#E3D6C7] hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-[#B99B75] to-[#CEB89E] rounded-full">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-[#324557] text-center">{secret.title}</CardTitle>
                  <p className="text-[#B99B75] text-center font-semibold" dir="rtl">
                    {secret.titleAr}
                  </p>
                  <CardDescription className="text-[#5F83A4] text-center leading-relaxed">
                    {secret.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {secret.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm text-[#5F83A4]">
                        <span className="text-[#B99B75] mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#324557] to-[#48647E] rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready for Your Perfect Stay?</h3>
          <p className="text-[#E3D6C7] text-lg mb-6 max-w-2xl mx-auto">
            Experience these principles firsthand at any of our managed properties across Saudi Arabia
          </p>
          <a
            href="/booking"
            className="inline-block bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Start Your Booking
          </a>
        </div>
      </div>
    </section>
  )
}
