import { blogPosts } from '@/lib/blog-data'

export async function GET() {
    const baseUrl = 'https://www.leli.rentals'

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Leli Rentals Blog</title>
        <link>${baseUrl}/blog</link>
        <description>The premier destination for all your rental needs. Discover amazing rentals for every occasion.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${blogPosts
            .map((post) => `
            <item>
              <title><![CDATA[${post.title}]]></title>
              <link>${baseUrl}/blog/${post.slug}</link>
              <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
              <pubDate>${new Date(post.date).toUTCString()}</pubDate>
              <description><![CDATA[${post.excerpt}]]></description>
              <author>${post.author.name}</author>
              <category>${post.category}</category>
            </item>
          `)
            .join('')}
      </channel>
    </rss>`

    return new Response(rss, {
        headers: {
            'Content-Type': 'text/xml',
            'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
        },
    })
}
