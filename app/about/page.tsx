import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutContent } from "@/components/pages/about-content"

export const metadata = {
  title: "About Us - Leli Rentals",
  description: "Learn about Leli Rentals and our mission to connect renters with quality items.",
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
