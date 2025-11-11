import { Navbar } from "@/components/navbar"
import { BlogGrid } from "@/components/blog-grid"
import { Footer } from "@/components/footer"

export default function BlogsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BlogGrid />
      </main>
      <Footer />
    </div>
  )
}
