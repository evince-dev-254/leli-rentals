import { Footer } from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - leli rentals",
  description: "Sign in to your leli rentals account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center gradient-mesh py-12 px-4">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
