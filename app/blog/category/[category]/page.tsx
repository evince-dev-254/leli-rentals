import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getPostsByCategory, categories, slugify } from "@/lib/blog-data"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface CategoryPageProps {
    params: Promise<{
        category: string
    }>
}

export function generateStaticParams() {
    return categories.map((category) => ({
        category: slugify(category),
    }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await params
    // Find the original category name by matching the slug
    const matchingCategory = categories.find(c => slugify(c) === category)
    const categoryName = matchingCategory || category.replace(/-/g, ' ')

    return {
        title: `${categoryName} - Leli Rentals Blog`,
        description: `Read articles about ${categoryName} on the Leli Rentals blog.`,
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category: slug } = await params

    // Find the matching category from our data source using the slug
    const categoryName = categories.find(c => slugify(c) === slug)

    // If we found a match, get posts for it. If not, try lenient matching or return empty
    const posts = categoryName ? getPostsByCategory(categoryName) : []

    if (!categoryName) {
        // Handle invalid category
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                <div className="container px-4 mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to All Posts
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight capitalize mb-4">
                            {categoryName}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-24 bg-secondary/20 rounded-3xl">
                            <p className="text-xl text-muted-foreground mb-4">No articles found in this category.</p>
                            <Button asChild>
                                <Link href="/blog">Browse all articles</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
