import { Award, Users, Building, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AboutDetails() {
  const stats = [
    {
      icon: Building,
      value: "50+",
      label: "Hotels Managed",
      labelAr: "فندق مُدار",
    },
    {
      icon: Users,
      value: "10K+",
      label: "Happy Guests",
      labelAr: "ضيف سعيد",
    },
    {
      icon: Award,
      value: "25+",
      label: "Years Experience",
      labelAr: "سنة خبرة",
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Satisfaction Rate",
      labelAr: "معدل الرضا",
    },
  ]

  return (
    <section className="py-20 px-4 bg-[#F7F4F0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-white border-[#E3D6C7] hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-[#B99B75] rounded-full">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-[#324557] mb-2">{stat.value}</h3>
                  <p className="text-[#5F83A4] font-semibold">{stat.label}</p>
                  <p className="text-[#B99B75] text-sm mt-1" dir="rtl">
                    {stat.labelAr}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AboutDetails
