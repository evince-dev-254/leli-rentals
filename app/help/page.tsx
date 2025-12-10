import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HelpContent } from "@/components/pages/help-content"

export const metadata = {
  title: "Help & Support - leli rentals",
  description: "Find answers to frequently asked questions and get support.",
}

export default function HelpPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HelpContent />
      </main>
      <Footer />
    </>
  )
}
