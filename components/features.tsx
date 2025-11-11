import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Award, Headphones } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your information is protected with industry-leading security",
  },
  {
    icon: Clock,
    title: "Best Price Guarantee",
    description: "Find a better price? We will match it and give you 10% off",
  },
  {
    icon: Award,
    title: "Premium Properties",
    description: "Curated selection of the finest hotels worldwide",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is always here to help you with your booking",
  },
]

export function Features() {
  return (
    <section className="py-16 bg-[#E3D6C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#324557] mb-4">Why Book With Us</h2>
          <p className="text-lg text-[#48647E] max-w-2xl mx-auto">
            Experience the difference with our exceptional service and benefits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-card">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B99B75] mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-[#324557] mb-3">{feature.title}</h3>

                <p className="text-[#48647E] text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
