import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { VerifyEmailContent } from "@/components/auth/verify-email-content"

export const metadata = {
  title: "Verify Email - Leli Rentals",
  description: "Verify your email address",
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center gradient-mesh py-12 px-4">
        <VerifyEmailContent />
      </main>
      <Footer />
    </div>
  )
}
