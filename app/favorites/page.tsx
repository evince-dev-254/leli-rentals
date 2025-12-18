import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FavoritesContent } from "@/components/favorites/favorites-content"

export const metadata = {
  title: "My Favorites | Leli Rentals",
  description: "View and manage your favorite rental listings on Leli Rentals",
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <FavoritesContent />
      </main>
      <Footer />
    </div>
  )
}
