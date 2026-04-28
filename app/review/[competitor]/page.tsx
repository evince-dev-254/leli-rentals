import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ComparisonPage } from "@/components/seo/comparison-page"
import {
    getAllReviewSlugs,
    getCompetitorByReviewSlug,
} from "@/lib/comparison-data"

export async function generateStaticParams() {
    return getAllReviewSlugs().map((slug) => ({ competitor: slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ competitor: string }>
}): Promise<Metadata> {
    const { competitor } = await params
    const data = getCompetitorByReviewSlug(competitor)
    if (!data) return {}

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"
    const url = `${siteUrl}/review/${competitor}`

    return {
        title: data.reviewTitle,
        description: data.reviewDescription,
        keywords: data.reviewKeywords,
        alternates: { canonical: url },
        openGraph: {
            title: data.reviewTitle,
            description: data.reviewDescription,
            url,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: data.reviewTitle,
            description: data.reviewDescription,
        },
        robots: { index: true, follow: true },
    }
}

export default async function ReviewPage({
    params,
}: {
    params: Promise<{ competitor: string }>
}) {
    const { competitor } = await params
    const data = getCompetitorByReviewSlug(competitor)
    if (!data) notFound()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <ComparisonPage competitor={data} type="review" />
            </main>
            <Footer />
        </div>
    )
}
