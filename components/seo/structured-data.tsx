import Script from 'next/script'

interface StructuredDataProps {
    data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
    return (
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
            strategy="afterInteractive"
        />
    )
}

// Organization Schema
export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Leli Rentals',
    alternateName: 'leli rentals',
    url: 'https://www.leli.rentals',
    logo: 'https://www.leli.rentals/logo.png',
    description: 'The premier destination for all your rental needs in Kenya. Rent vehicles, homes, equipment, and more.',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'KE',
        addressLocality: 'Nairobi',
    },
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'support@leli.rentals',
        availableLanguage: ['English', 'Swahili'],
    },
    sameAs: [
        'https://twitter.com/lelirentals',
        'https://facebook.com/lelirentals',
        'https://instagram.com/lelirentals',
        'https://tiktok.com/@lelirentals',
    ],
}

// Website Schema
export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Leli Rentals',
    url: 'https://www.leli.rentals',
    description: 'The premier destination for all your rental needs in Kenya.',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.leli.rentals/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }
}

// Product/Service Schema Generator
export function generateServiceSchema(service: {
    name: string
    description: string
    provider: string
    areaServed: string
    url: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
            '@type': 'Organization',
            name: service.provider,
        },
        areaServed: {
            '@type': 'Country',
            name: service.areaServed,
        },
        url: service.url,
    }
}
