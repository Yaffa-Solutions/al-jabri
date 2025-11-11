import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"

export function BlogGrid() {
  const blogs = [
    {
      title: "The Future of Hospitality Management",
      titleAr: "مستقبل إدارة الضيافة",
      description:
        "Discover the latest trends shaping the hotel industry and how we're adapting to meet modern traveler expectations.",
      date: "January 15, 2025",
      author: "Sarah Ahmed",
      image: "/luxury-hotel-lobby-modern-design.jpg",
    },
    {
      title: "Creating Memorable Guest Experiences",
      titleAr: "إنشاء تجارب لا تُنسى للضيوف",
      description:
        "Learn about our approach to hospitality that puts guest satisfaction at the heart of everything we do.",
      date: "January 10, 2025",
      author: "Mohammed Al-Jabri",
      image: "/hotel-reception-luxury-service.jpg",
    },
    {
      title: "Sustainable Hotel Operations in KSA",
      titleAr: "عمليات الفنادق المستدامة في المملكة",
      description: "How we're implementing eco-friendly practices while maintaining world-class service standards.",
      date: "January 5, 2025",
      author: "Fatima Hassan",
      image: "/sustainable-eco-friendly-hotel.jpg",
    },
    {
      title: "Digital Transformation in Hotels",
      titleAr: "التحول الرقمي في الفنادق",
      description: "Exploring how technology is revolutionizing the guest experience from booking to checkout.",
      date: "December 28, 2024",
      author: "Ahmed Khalil",
      image: "/hotel-technology-digital-check-in.jpg",
    },
    {
      title: "Staff Training Excellence",
      titleAr: "التميز في تدريب الموظفين",
      description:
        "Our comprehensive approach to developing hospitality professionals who deliver exceptional service.",
      date: "December 20, 2024",
      author: "Layla Ibrahim",
      image: "/hotel-staff-training-professional.jpg",
    },
    {
      title: "Maximizing Hotel Profitability",
      titleAr: "زيادة ربحية الفنادق",
      description: "Strategic insights into revenue management and operational efficiency in the hospitality sector.",
      date: "December 15, 2024",
      author: "Omar Mansour",
      image: "/hotel-business-growth-success.jpg",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#F7F4F0] to-[#E3D6C7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#324557] mb-4">Our Blog</h1>
          <h2 className="text-3xl font-bold text-[#B99B75] mb-4" dir="rtl">
            مدونتنا
          </h2>
          <p className="text-lg text-[#5F83A4] max-w-2xl mx-auto">
            Insights, tips, and stories from the world of hospitality management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Card key={index} className="bg-white border-[#E3D6C7] hover:shadow-xl transition-shadow overflow-hidden">
              <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-[#86A1BA] mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{blog.author}</span>
                  </div>
                </div>
                <CardTitle className="text-[#324557] hover:text-[#B99B75] transition-colors">{blog.title}</CardTitle>
                <p className="text-[#B99B75] text-sm font-semibold" dir="rtl">
                  {blog.titleAr}
                </p>
                <CardDescription className="text-[#5F83A4]">{blog.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-[#B99B75] hover:text-[#CEB89E] hover:bg-[#F7F4F0] gap-2 p-0">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
