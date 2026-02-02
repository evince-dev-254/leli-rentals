import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactContent } from "@/components/pages/contact-content"

export const metadata = {
  title: "Contact Us - Get in Touch",
  description: "Have questions? Get in touch with the Leli Rentals support team. We're here to help with your rental needs, account issues, or partnership inquiries. Contact us via email, phone, or visit our Nairobi office.",
  keywords: ["contact leli rentals", "customer support Kenya", "rental help", "leli rentals support"],
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
