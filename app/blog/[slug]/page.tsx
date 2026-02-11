import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getPostBySlug, blogPosts } from "@/lib/blog-data"
import { BlogHero } from "@/components/blog/blog-hero"
import { SocialShare } from "@/components/blog/social-share"
import { RelatedArticles } from "@/components/blog/related-articles"
import { Separator } from "@/components/ui/separator"
import { RatingComponent } from "@/components/blog/rating-component"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { generatePageMetadata } from "@/lib/metadata"
import { supabase } from "@/lib/supabase"

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

async function getBlogPost(slug: string) {
    // 1. Try fetching from Supabase
    const { data: dbPost } = await supabaseAdmin
        .from("blog_index_view")
        .select("*")
        .eq("slug", slug)
        .single()

    if (dbPost) {
        return {
            ...dbPost,
            coverImage: dbPost.cover_image,
            date: dbPost.created_at,
            readingTime: dbPost.reading_time,
            author: {
                name: dbPost.author_name,
                avatar: dbPost.author_avatar,
                role: dbPost.author_role
            }
        }
    }

    // 2. Fallback to static data
    return getPostBySlug(slug)
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        return {
            title: "Post Not Found",
        }
    }

    return generatePageMetadata({
        title: `${post.title} | Leli Rentals Blog`,
        description: post.excerpt,
        path: `/blog/${post.slug}`,
        image: post.coverImage,
        keywords: [post.category, ...post.tags || []]
    })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <>
            <Header />
            <main className="min-h-screen">
                <BlogHero post={post as any} />

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 max-w-6xl mx-auto">

                        <div className="space-y-12">
                            {/* Main Content */}
                            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-extrabold prose-h2:text-3xl prose-p:text-muted-foreground prose-p:leading-relaxed">
                                <div
                                    className="blog-content"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </article>

                            <Separator />

                            {/* Rating System */}
                            <section id="reviews">
                                <RatingComponent
                                    blogId={(post as any).id || post.slug}
                                    initialRating={(post as any).average_rating || 0}
                                    reviewCount={(post as any).review_count || 0}
                                />
                            </section>
                        </div>

                        {/* Sidebar / Social Share */}
                        <aside className="space-y-8">
                            <div className="sticky top-24 space-y-8">
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                    <h4 className="font-bold mb-4">Share this story</h4>
                                    <SocialShare slug={post.slug} title={post.title} />
                                </div>

                                <Card className="p-6 rounded-3xl border-border/50 bg-secondary/10 shadow-none border-none">
                                    <h4 className="font-bold mb-2">Want to write for us?</h4>
                                    <p className="text-sm text-muted-foreground mb-4">Share your rental stories and tips with our growing community across Kenya.</p>
                                    <Button asChild variant="outline" className="w-full rounded-xl border-primary text-primary hover:bg-primary/5">
                                        <Link href="/blog/create">Get Started</Link>
                                    </Button>
                                </Card>
                            </div>
                        </aside>
                    </div>

                    <div className="max-w-6xl mx-auto mt-16 lg:mt-24">
                        <Separator className="mb-12" />
                        <h3 className="text-2xl font-bold mb-8 items-center flex gap-2">
                            <div className="h-2 w-8 bg-primary rounded-full" />
                            More like this
                        </h3>
                        <RelatedArticles currentSlug={post.slug} />
                    </div>
                </div>
            </main>
            <Footer />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: post.title,
                        image: [post.coverImage],
                        datePublished: post.date,
                        dateModified: post.date,
                        author: [{
                            "@type": "Person",
                            name: post.author.name,
                            url: `https://www.leli.rentals/blog/author/${post.author.name.toLowerCase().replace(' ', '-')}`
                        }],
                        publisher: {
                            "@type": "Organization",
                            name: "Leli Rentals",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://www.leli.rentals/logo.png"
                            }
                        },
                        aggregateRating: (post as any).average_rating > 0 ? {
                            "@type": "AggregateRating",
                            ratingValue: (post as any).average_rating,
                            reviewCount: (post as any).review_count
                        } : undefined
                    }),
                }}
            />
        </>
    )
}

// Re-using Card components implicitly via types or imports would be better, 
// using generic div for aside cards for now to match detail style.
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
