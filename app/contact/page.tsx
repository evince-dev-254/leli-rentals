import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactContent } from "@/components/pages/contact-content"

export const metadata = {
  title: "Contact Us - leli rentals",
  description: "Get in touch with our team. We're here to help.",
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <ContactContent />
      </main>
      <Footer />
    </>
  )
}
