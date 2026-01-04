import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategoriesPageContent } from "@/components/categories/categories-page-content"

export const metadata = {
  title: "All Categories - leli rentals",
  description: "Browse all rental categories. Find vehicles, homes, equipment, electronics, fashion, and more.",
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <CategoriesPageContent />
      </main>
      <Footer />
    </div>
  )
}
