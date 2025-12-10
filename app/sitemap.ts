import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.leli.rentals'

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/contact',
        '/help',
        '/careers',
        '/become-owner',
        '/terms',
        '/privacy',
        '/cookies',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Category pages
    const categories = [
        'vehicles',
        'homes',
        'equipment',
        'electronics',
        'fashion',
        'entertainment',
        'events',
    ].map((category) => ({
        url: `${baseUrl}/categories/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Add categories index page
    const categoriesIndex = {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }

    return [...staticPages, categoriesIndex, ...categories]
}
