import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata = {
  title: "Forgot Password - Leli Rentals",
  description: "Reset your Leli Rentals account password.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background">
        <ForgotPasswordForm />
      </main>
      <Footer />
    </div>
  )
}
