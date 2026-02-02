import type { MetadataRoute } from 'next'
import { blogPosts, categories as blogCategories, slugify } from '@/lib/blog-data'

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

    // Category pages - using actual category IDs from categories-data.ts
    const categories = [
        'vehicles',
        'living',
        'equipment',
        'electronics',
        'fashion',
        'entertainment',
        'utility',
        'business',
        'photography',
        'fitness',
        'baby',
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

    // Blog Pages
    const blogIndex = {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }

    const blogPostEntries = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    const blogCategoryEntries = blogCategories.map((category) => ({
        url: `${baseUrl}/blog/category/${slugify(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...staticPages, categoriesIndex, ...categories, blogIndex, ...blogPostEntries, ...blogCategoryEntries]
}
