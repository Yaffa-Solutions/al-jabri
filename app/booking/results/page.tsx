import Navbar from "@/components/navbar"
import SearchResults from "@/components/search-results"
import Footer from "@/components/footer"

export default function SearchResultsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <SearchResults />
      </main>
      <Footer />
    </div>
  )
}
