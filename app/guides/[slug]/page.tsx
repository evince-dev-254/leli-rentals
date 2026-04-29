import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GuidePage } from "@/components/seo/guide-page"
import { getAllGuideSlugs, getGuideBySlug, getRelatedGuides } from "@/lib/guides-data"

export async function generateStaticParams() {
    return getAllGuideSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const guide = getGuideBySlug(slug)
    if (!guide) return {}

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"
    const url = `${siteUrl}/guides/${slug}`

    return {
        title: guide.metaTitle,
        description: guide.metaDescription,
        keywords: guide.keywords,
        alternates: { canonical: url },
        openGraph: {
            title: guide.metaTitle,
            description: guide.metaDescription,
            url,
            type: "article",
            publishedTime: guide.publishDate,
            modifiedTime: guide.lastUpdated,
            images: [{ url: guide.heroImage, width: 1200, height: 630, alt: guide.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: guide.metaTitle,
            description: guide.metaDescription,
            images: [guide.heroImage],
        },
        robots: { index: true, follow: true },
    }
}

export default async function GuideSlugPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const guide = getGuideBySlug(slug)
    if (!guide) notFound()

    const relatedGuides = getRelatedGuides(slug)

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <GuidePage guide={guide} relatedGuides={relatedGuides} />
            </main>
            <Footer />
        </div>
    )
}