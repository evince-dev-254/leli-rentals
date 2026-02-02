import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategoriesPageContent } from "@/components/categories/categories-page-content"

export const metadata = {
  title: "All Categories - Browse Rentals",
  description: "Explore all rental categories on Leli Rentals. Find vehicles, living spaces, equipment & tools, electronics, fashion & accessories, entertainment, utility spaces, business spaces, photography gear, fitness equipment, and baby & kids items. Rent anything you need in Kenya.",
  keywords: ["rental categories", "browse rentals Kenya", "all categories", "rental marketplace"],
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <CategoriesPageContent />
      </main>
      <Footer />
    </div>
  )
}
