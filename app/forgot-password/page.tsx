import { Footer } from "@/components/layout/footer"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata = {
  title: "Forgot Password - leli rentals",
  description: "Reset your leli rentals account password.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <ForgotPasswordForm />
      </main>
      <Footer />
    </div>
  )
}
