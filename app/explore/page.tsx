import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ExploreContent } from "@/components/seo/explore-content"

export const metadata: Metadata = {
  title: "Explore All Rentals Worldwide | Leli Rentals",
  description:
    "Browse all rental categories and cities on Leli Rentals. Find vehicles, living spaces, photography equipment, electronics, fashion, baby gear and more in 100 cities worldwide.",
  alternates: {
    canonical: "https://www.leli.rentals/explore",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ExploreContent />
      </main>
      <Footer />
    </div>
  )
}
