import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"

const hotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    rating: 4.8,
    reviews: 342,
    price: 299,
    image: "/luxury-hotel-exterior-grand-plaza.jpg",
  },
  {
    id: 2,
    name: "Seaside Resort & Spa",
    location: "Maldives",
    rating: 4.9,
    reviews: 528,
    price: 450,
    image: "/luxury-maldives-resort.png",
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Swiss Alps",
    rating: 4.7,
    reviews: 215,
    price: 350,
    image: "/mountain-lodge-swiss-alps.jpg",
  },
  {
    id: 4,
    name: "Urban Boutique Hotel",
    location: "Tokyo, Japan",
    rating: 4.6,
    reviews: 412,
    price: 225,
    image: "/boutique-hotel-tokyo.jpg",
  },
]

export function FeaturedHotels() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Hotels</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked luxury accommodations for unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  ${hotel.price}/night
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 text-balance">{hotel.name}</h3>

                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hotel.location}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-[#B99B75] text-[#B99B75]" />
                    <span className="ml-1 font-semibold text-foreground">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({hotel.reviews} reviews)</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary hover:bg-[#48647E] text-primary-foreground">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            View All Hotels
          </Button>
        </div>
      </div>
    </section>
  )
}
