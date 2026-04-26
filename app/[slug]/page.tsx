import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  resolveSeoSlug,
  getSeoCategoryById,
  generateSeoPageMeta,
} from "@/lib/seo-pages-data"
import { SeoLandingPage } from "@/components/seo/seo-landing-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const revalidate = 2592000 // 30 days

// ─── STATIC PARAMS ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return []
}

// ─── METADATA ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = resolveSeoSlug(slug)
  if (!page) return {}

  const category = getSeoCategoryById(page.categoryId)
  if (!category) return {}

  const meta = generateSeoPageMeta(page, category)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"
  const url = `${siteUrl}/${slug}`
  const image =
    page.intent === "renter"
      ? category.images.renter
      : category.images.owner

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default async function SeoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = resolveSeoSlug(slug)

  if (!page) {
    notFound()
  }

  const category = getSeoCategoryById(page.categoryId)
  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SeoLandingPage page={page} category={category} />
      </main>
      <Footer />
    </div>
  )
}
