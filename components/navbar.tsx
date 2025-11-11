import { Building2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#324557] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#B99B75]" />
            <span className="text-xl font-bold">Hotels Management</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              Home
            </a>
            <a href="#about" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              About Us
            </a>
            <a href="#hotels" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              Hotels
            </a>
            <a href="#services" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              Services
            </a>
            <a href="#contact" className="text-[#E3D6C7] hover:text-[#B99B75] transition-colors">
              Contact
            </a>
            <Button className="bg-[#B99B75] hover:bg-[#CEB89E] text-[#324557] font-semibold">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button size="icon" variant="ghost" className="md:hidden text-white hover:bg-[#48647E]">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
