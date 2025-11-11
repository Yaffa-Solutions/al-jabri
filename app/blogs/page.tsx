import Navbar from "@/components/navbar"
import BlogGrid from "@/components/blog-grid"
import Footer from "@/components/footer"

export default function BlogsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <BlogGrid />
      </main>
      <Footer />
    </div>
  )
}
