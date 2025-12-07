import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RenterDashboard } from "@/components/dashboard/renter-dashboard"

export default function RenterDashboardPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-secondary/10">
                <RenterDashboard />
            </main>
            <Footer />
        </div>
    )
}
