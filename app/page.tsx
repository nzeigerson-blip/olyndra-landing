import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { EarlyAccess } from "@/components/early-access"
import { Footer } from "@/components/footer"
import { LegalSections } from "@/components/legal-sections"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <EarlyAccess />
      <Footer />
    </main>
  )
}
