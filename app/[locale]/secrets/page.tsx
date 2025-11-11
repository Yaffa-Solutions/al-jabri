import { Navbar } from "@/components/navbar"
import { SecretsGuide } from "@/components/secrets-guide"
import { Footer } from "@/components/footer"

export default function SecretsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <SecretsGuide />
      </main>
      <Footer />
    </div>
  )
}
