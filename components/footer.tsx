import { Building2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-[#324557] text-[#F7F4F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-[#B99B75]" />
              <span className="text-xl font-bold">Luxe Hotels</span>
            </div>
            <p className="text-[#CEB89E] text-sm mb-4">
              Your gateway to luxury accommodations worldwide. Experience comfort and elegance.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-[#48647E] hover:text-[#B99B75]">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#B99B75]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Special Offers
                </a>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#B99B75]">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#CEB89E] hover:text-[#B99B75] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#B99B75]">Newsletter</h3>
            <p className="text-[#CEB89E] text-sm mb-4">Subscribe to get special offers and updates</p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-[#48647E] border-[#5F83A4] text-white placeholder:text-[#CEB89E]"
              />
              <Button className="bg-[#B99B75] hover:bg-[#CEB89E] text-[#324557] whitespace-nowrap">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#48647E] pt-8 text-center text-sm text-[#CEB89E]">
          <p>&copy; {new Date().getFullYear()} Luxe Hotels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
