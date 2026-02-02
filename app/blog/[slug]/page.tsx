import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getPostBySlug, blogPosts } from "@/lib/blog-data"
import { BlogHero } from "@/components/blog/blog-hero"
import { SocialShare } from "@/components/blog/social-share"
import { RelatedArticles } from "@/components/blog/related-articles"
import { Separator } from "@/components/ui/separator"

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return {
            title: "Post Not Found",
        }
    }

    return {
        title: `${post.title} | Leli Rentals Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            authors: [post.author.name],
            images: [post.coverImage],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        },
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <>
            <Header />
            <main className="min-h-screen">
                <BlogHero post={post} />

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 max-w-6xl mx-auto">

                        {/* Main Content */}
                        <article className="prose prose-lg dark:prose-invert max-w-none">
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </article>

                        {/* Sidebar / Social Share */}
                        <aside className="hidden lg:block relative">
                            <SocialShare slug={post.slug} title={post.title} />
                        </aside>
                    </div>

                    <div className="max-w-4xl mx-auto mt-16 lg:mt-24">
                        <Separator className="mb-12" />
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
                        }
                    }),
                }}
            />
        </>
    )
}
