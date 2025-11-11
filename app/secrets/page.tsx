import Navbar from "@/components/navbar"
import SecretsContent from "@/components/secrets-content"
import Footer from "@/components/footer"

export default function SecretsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <SecretsContent />
      </main>
      <Footer />
    </div>
  )
}
