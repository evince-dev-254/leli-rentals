import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leli.rentals'

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Leli Rentals - Find Your Perfect Rental in Kenya",
        template: "%s | Leli Rentals"
    },
    description:
        "Leli Rentals is Kenya's premier peer-to-peer rental marketplace. Rent cars, homes, equipment, electronics, fashion & more. Find exactly what you need, when you need it safely.",
    openGraph: {
        type: 'website',
        locale: 'en_KE',
        url: siteUrl,
        siteName: 'Leli Rentals',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Leli Rentals - Rent Anything, Anytime',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@lelirentals',
    },
}

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata({
    title,
    description,
    path = '',
    image,
    keywords = [],
}: {
    title: string
    description: string
    path?: string
    image?: string
    keywords?: string[]
}): Metadata {
    const url = `${siteUrl}${path}`
    const ogImage = image || '/og-image.png'

    return {
        title,
        description,
        keywords: [
            "rentals", "peer to peer", "Kenya", "marketplace",
            ...keywords
        ],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            title,
            description,
            images: [ogImage],
        },
    }
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'leli rentals',
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description: 'The premier destination for all your rental needs in Kenya.',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'KE',
            addressLocality: 'Nairobi',
        },
        sameAs: [
            'https://twitter.com/lelirentals',
            'https://facebook.com/lelirentals',
            'https://instagram.com/lelirentals',
        ],
    }
}

/**
 * Generate structured data for website
 */
export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'leli rentals',
        url: siteUrl,
        description: 'The premier destination for all your rental needs in Kenya.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }
}
