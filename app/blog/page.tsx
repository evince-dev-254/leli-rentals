import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { blogPosts, categories } from "@/lib/blog-data"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const metadata: Metadata = {
    title: "Blog - Rental Tips, Market Insights & News | Leli Rentals",
    description: "Stay updated with the latest trends in the rental market, tips for renters and owners, and Leli Rentals platform updates.",
    openGraph: {
        title: "Leli Rentals Blog",
        description: "Your guide to the sharing economy and rental market in Kenya.",
        images: ["/blog/blog-og.jpg"],
    },
}

export default function BlogPage() {
    const featuredPost = blogPosts.find((post) => post.featured)
    const recentPosts = blogPosts.filter((post) => post.slug !== featuredPost?.slug)

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
                    <div className="container relative z-10 px-4 mx-auto text-center max-w-3xl">
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-6 text-balance">
                            Leli Rentals <span className="text-primary">Blog</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 text-pretty">
                            Discover tips, guides, and insights to help you get the most out of your rental experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search articles..." className="pl-9" />
                            </div>
                            <Button>Search</Button>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="border-y border-border/50 bg-secondary/20 sticky top-16 z-30 backdrop-blur-md">
                    <div className="container px-4 mx-auto overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 py-4 min-w-max">
                            <Button variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                                All Posts
                            </Button>
                            {categories.map((category) => (
                                <Button key={category} variant="ghost" className="text-muted-foreground hover:text-foreground">
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container px-4 mx-auto py-12 space-y-16">
                    {/* Featured Post */}
                    {featuredPost && (
                        <section>
                            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
                            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center bg-card/50 rounded-3xl border border-border/50 overflow-hidden p-6 md:p-8 backdrop-blur-sm">
                                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={featuredPost.coverImage}
                                        alt={featuredPost.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                            {featuredPost.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{featuredPost.readingTime}</span>
                                    </div>
                                    <Link href={`/blog/${featuredPost.slug}`} className="block group">
                                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                                            {featuredPost.title}
                                        </h3>
                                        <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={featuredPost.author.avatar}
                                            alt={featuredPost.author.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{featuredPost.author.name}</p>
                                            <p className="text-xs text-muted-foreground">{featuredPost.author.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Recent Posts Grid */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Latest Articles</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentPosts.map((post) => (
                                <BlogCard key={post.slug} post={post} />
                            ))}
                        </div>
                    </section>

                    {/* Newsletter CTA */}
                    <section className="py-16 md:py-24">
                        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

                            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                <h2 className="text-3xl md:text-4xl font-bold">Subscribe to our Newsletter</h2>
                                <p className="text-primary-foreground/80 text-lg">
                                    Get the latest rental tips, exclusive offers, and market insights delivered straight to your inbox.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-white/10 border-white/20 text-white placeholder:text-primary-foreground/60 focus-visible:ring-white/30"
                                    />
                                    <Button variant="secondary" className="whitespace-nowrap font-bold">
                                        Subscribe Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}
