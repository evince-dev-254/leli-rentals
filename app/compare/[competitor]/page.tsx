import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ComparisonPage } from "@/components/seo/comparison-page"
import {
    getAllCompareSlugs,
    getCompetitorByCompareSlug,
} from "@/lib/comparison-data"

export async function generateStaticParams() {
    return getAllCompareSlugs().map((slug) => ({ competitor: slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ competitor: string }>
}): Promise<Metadata> {
    const { competitor } = await params
    const data = getCompetitorByCompareSlug(competitor)
    if (!data) return {}

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"
    const url = `${siteUrl}/compare/${competitor}`

    return {
        title: data.compareTitle,
        description: data.compareDescription,
        keywords: data.compareKeywords,
        alternates: { canonical: url },
        openGraph: {
            title: data.compareTitle,
            description: data.compareDescription,
            url,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: data.compareTitle,
            description: data.compareDescription,
        },
        robots: { index: true, follow: true },
    }
}

export default async function ComparePage({
    params,
}: {
    params: Promise<{ competitor: string }>
}) {
    const { competitor } = await params
    const data = getCompetitorByCompareSlug(competitor)
    if (!data) notFound()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <ComparisonPage competitor={data} type="compare" />
            </main>
            <Footer />
        </div>
    )
}
