import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EarningCalculator } from "@/components/seo/earning-calculator"
import { getCalculatorCategoryBySlug, calculatorCategories } from "@/lib/calculator-data"

// ─── STATIC PARAMS ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return calculatorCategories.map((cat) => ({ category: cat.slug }))
}

// ─── METADATA ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getCalculatorCategoryBySlug(category)
  if (!cat) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"
  const url = `${siteUrl}/earn/${category}`

  return {
    title: `${cat.headline} | Leli Rentals`,
    description: cat.subheadline,
    keywords: cat.seoKeywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.headline} | Leli Rentals`,
      description: cat.subheadline,
      url,
      images: [{ url: cat.image, width: 1200, height: 630, alt: cat.headline }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.headline} | Leli Rentals`,
      description: cat.subheadline,
      images: [cat.image],
    },
    // WebApplication schema tells Google this is an interactive tool
    // which can trigger a "Calculate" button in search results
    other: {
      "application-name": `${cat.name} Rental Income Calculator`,
    },
  }
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default async function EarnPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getCalculatorCategoryBySlug(category)

  if (!cat) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"

  // WebApplication schema for Google rich results
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${cat.name} Rental Income Calculator`,
    description: cat.subheadline,
    applicationCategory: "FinanceApplication",
    url: `${siteUrl}/earn/${category}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Instant rental income calculation",
      "Multi-currency support",
      "Category-specific item rates",
      "ROI comparison vs subscription cost",
    ],
  }

  // FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much can I earn renting my ${cat.name.toLowerCase()} on Leli Rentals?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Your earnings depend on the specific item, its condition, and rental frequency. Use our ${cat.name} rental income calculator above to get an instant estimate based on real market rates. Many ${cat.name.toLowerCase()} owners earn between $200 and $2,000 per month on Leli Rentals.`,
        },
      },
      {
        "@type": "Question",
        name: `How does the ${cat.name.toLowerCase()} rental income calculator work?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Simply enter the name of your ${cat.name.toLowerCase()} item in the search box or select from the popular items list. Our calculator matches your item to real market rental rates and calculates your estimated daily, weekly, monthly, and yearly earnings. You can also select your preferred currency to see earnings in your local currency.`,
        },
      },
      {
        "@type": "Question",
        name: "How much does Leli Rentals charge owners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Leli Rentals charges a flat monthly subscription of $10 per month for unlimited listings, or $5 per week for up to 10 listings. We take zero commission from your rental earnings — every cent your item earns goes directly to you.",
        },
      },
      {
        "@type": "Question",
        name: "How do I start listing my items on Leli Rentals?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Creating a listing on Leli Rentals takes less than 5 minutes. Simply create a free account, click Add New Listing, upload photos of your item, write a description, set your daily rate, and publish. Your listing will be visible to renters worldwide immediately.",
        },
      },
      {
        "@type": "Question",
        name: "When and how do I get paid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Payments are processed securely through the Leli Rentals platform. Funds are released to your account after the rental period begins and can be withdrawn directly to your bank account or mobile money wallet.",
        },
      },
    ],
  }

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <EarningCalculator category={cat} />
        </main>
        <Footer />
      </div>
    </>
  )
}
