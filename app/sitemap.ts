import type { MetadataRoute } from 'next'
import { blogPosts, categories as blogCategories, slugify } from '@/lib/blog-data'
import { supabase } from '@/lib/supabase'
import { getAllSeoSlugs } from '@/lib/seo-pages-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.leli.rentals'

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/contact',
        '/help',
        '/careers',
        '/become-owner',
        '/explore',
        '/terms',
        '/privacy',
        '/cookies',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date('2026-02-11'), // Use a fixed recent date for static pages
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Category pages
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

    // Fetch dynamic blogs from Supabase
    const { data: dbBlogs } = await supabase
        .from('blogs')
        .select('slug, updated_at')

    const dbBlogEntries = (dbBlogs || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Keep static blogs as fallback (only those not in DB)
    const dbSlugs = new Set((dbBlogs || []).map(b => b.slug))
    const staticBlogEntries = blogPosts
        .filter(post => !dbSlugs.has(post.slug))
        .map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7, // Lower priority for legacy static posts
        }))

    const blogCategoryEntries = blogCategories.map((category) => ({
        url: `${baseUrl}/blog/category/${slugify(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Fetch listings from database
    const { data: listings } = await supabase
        .from('listings')
        .select('id, updated_at')
        .eq('status', 'approved')
        .in('availability_status', ['available', 'rented'])

    const listingEntries = (listings || []).map((listing) => ({
        url: `${baseUrl}/listings/${listing.id}`,
        lastModified: new Date(listing.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

  // SEO Programmatic Pages (16,808 pages)
  const seoSlugs = getAllSeoSlugs()
  const seoEntries = seoSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date('2026-04-26'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

    return [
        ...staticPages,
        categoriesIndex,
        ...categories,
        blogIndex,
        ...dbBlogEntries,
        ...staticBlogEntries,
        ...blogCategoryEntries,
        ...listingEntries,
        ...seoEntries
    ]
}
