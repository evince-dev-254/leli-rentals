import { Footer } from "@/components/layout/footer"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "Sign Up - leli rentals",
  description: "Create your leli rentals account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center gradient-mesh py-12 px-4">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}
