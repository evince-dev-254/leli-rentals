import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutContent } from "@/components/pages/about-content"

export const metadata = {
  title: "About Us - Our Story",
  description: "Learn about Leli Rentals and our mission to revolutionize the rental marketplace in Kenya. Discover how we connect renters with quality items across vehicles, homes, equipment, and more. Building Africa's premier peer-to-peer rental platform.",
  keywords: ["about leli rentals", "rental marketplace Kenya", "peer to peer rentals", "sharing economy Kenya"],
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
