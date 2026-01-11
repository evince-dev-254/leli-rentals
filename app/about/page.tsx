import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutContent } from "@/components/pages/about-content"

export const metadata = {
  title: "About Us - leli rentals",
  description: "Learn about leli rentals and our mission to connect renters with quality items.",
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
