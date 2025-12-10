
import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import { Footer } from "@/components/layout/footer"

export const metadata = {
    title: "Update Password - leli rentals",
    description: "Set a new password for your account",
}

export default function UpdatePasswordPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center gradient-mesh py-12 px-4">
                <UpdatePasswordForm />
            </main>
            <Footer />
        </div>
    )
}
