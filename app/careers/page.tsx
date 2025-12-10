import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CareersContent } from "@/components/pages/careers-content"

export const metadata = {
  title: "Careers - leli rentals",
  description: "Join our team and help shape the future of rentals.",
}

export default function CareersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <CareersContent />
      </main>
      <Footer />
    </>
  )
}
