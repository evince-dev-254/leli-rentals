import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategoryDetailContent } from "@/components/categories/category-detail-content"
import { BackButton } from "@/components/ui/back-button"
import { getCategoryById, categories } from "@/lib/categories-data"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params
  const category = getCategoryById(categoryId)
  if (!category) return { title: "Category Not Found" }

  return {
    title: `${category.name} Rentals - Leli Rentals`,
    description: category.longDescription,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params
  const category = getCategoryById(categoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <BackButton href="/" label="Back to Home" />
        </div>
        <CategoryDetailContent categoryId={category.id} />
      </main>
      <Footer />
    </div>
  )
}
