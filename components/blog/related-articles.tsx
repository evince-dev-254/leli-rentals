import { BlogPost, getRelatedPosts } from "@/lib/blog-data"
import { BlogCard } from "./blog-card"

interface RelatedArticlesProps {
    currentSlug: string
}

export function RelatedArticles({ currentSlug }: RelatedArticlesProps) {
    const relatedPosts = getRelatedPosts(currentSlug)

    if (relatedPosts.length === 0) return null

    return (
        <section className="py-12 border-t border-border/50">
            <div className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>
            </div>
        </section>
    )
}
