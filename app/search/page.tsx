import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SearchContent } from "@/components/search/search-content"

export const metadata = {
    title: "Search Results | Leli Rentals",
    description: "Find your perfect rental across Kenya. Browse vehicles, equipment, homes, and more.",
}

export default function SearchPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-secondary/30">
                <SearchContent />
            </main>
            <Footer />
        </div>
    )
}
