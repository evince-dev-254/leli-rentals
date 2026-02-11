import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"

const CategoriesSection = dynamic(() => import("@/components/home/categories-section").then(mod => mod.CategoriesSection), {
  loading: () => <div className="h-96 animate-pulse bg-muted/20" />
})
const FeaturedListings = dynamic(() => import("@/components/home/featured-listings").then(mod => mod.FeaturedListings), {
  loading: () => <div className="h-[600px] animate-pulse bg-muted/20" />
})
const FeaturesSection = dynamic(() => import("@/components/home/features-section").then(mod => mod.FeaturesSection))
const NewsletterSection = dynamic(() => import("@/components/home/newsletter-section").then(mod => mod.NewsletterSection))

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedListings />
        <FeaturesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
