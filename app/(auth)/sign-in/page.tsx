import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
    title: "Sign In - Leli Rentals",
    description: "Sign in to your Leli Rentals account",
}

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center gradient-mesh py-12 px-4">
                <LoginForm />
            </main>
            <Footer />
        </div>
    )
}
