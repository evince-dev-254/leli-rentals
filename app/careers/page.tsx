import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CareersContent } from "@/components/pages/careers-content"

export const metadata = {
  title: "Careers - Join Our Team",
  description: "Join the Leli Rentals team and help shape the future of rentals in Kenya. We're hiring talented developers, designers, and customer success professionals. Explore open positions in Nairobi and remote opportunities.",
  keywords: ["careers Kenya", "tech jobs Nairobi", "startup jobs Kenya", "remote jobs Kenya", "leli rentals careers"],
}

export default function CareersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <CareersContent />
      </main>
      <Footer />
    </>
  )
}
