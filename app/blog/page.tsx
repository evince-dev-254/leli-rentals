"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Sparkles, Loader2, Star } from "lucide-react"
import { categories } from "@/lib/blog-data"

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/blog")
                if (!response.ok) throw new Error("Failed to fetch posts")
                const data = await response.json()
                setPosts(data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const featuredPost = posts.find((post) => post.featured) || posts[0]
    const recentPosts = posts.filter((post) => post.slug !== featuredPost?.slug)

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
                    <div className="container relative z-10 px-4 mx-auto text-center max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
                            <Sparkles className="h-4 w-4" />
                            <span>AI-Powered Insights</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-6 text-balance">
                            Leli Rentals <span className="text-primary">Blog</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 text-pretty">
                            Discover tips, guides, and insights to help you get the most out of your rental experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search articles..."
                                    className="pl-9 h-12 rounded-xl border-2"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="h-12 px-8 rounded-xl font-bold">Search</Button>
                            <Button asChild variant="outline" className="h-12 px-6 rounded-xl border-primary text-primary hover:bg-primary/5 gap-2">
                                <Link href="/blog/create">
                                    <Plus className="h-5 w-5" />
                                    Write a Post
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="border-y border-border/50 bg-secondary/20 sticky top-16 z-30 backdrop-blur-md">
                    <div className="container px-4 mx-auto overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 py-4 min-w-max">
                            <Button variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 shadow-none">
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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-muted-foreground font-medium">Loading latest stories...</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured Post */}
                            {featuredPost && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                        <div className="h-2 w-8 bg-primary rounded-full" />
                                        Featured Article
                                    </h2>
                                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center bg-card/50 rounded-3xl border border-border/50 overflow-hidden p-6 md:p-8 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={featuredPost.cover_image || featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                                        {featuredPost.category}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">{featuredPost.reading_time || featuredPost.readingTime}</span>
                                                </div>
                                                {featuredPost.average_rating > 0 && (
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-600">
                                                        <Star className="h-4 w-4 fill-yellow-600" />
                                                        <span>{Number(featuredPost.average_rating).toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Link href={`/blog/${featuredPost.slug}`} className="block group">
                                                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 group-hover:text-primary transition-colors leading-tight">
                                                    {featuredPost.title}
                                                </h3>
                                                <p className="text-muted-foreground text-lg mb-6 line-clamp-3 leading-relaxed">
                                                    {featuredPost.excerpt}
                                                </p>
                                            </Link>
                                            <div className="flex items-center gap-4">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={featuredPost.author_avatar || (featuredPost.author && featuredPost.author.avatar) || "/logo.png"}
                                                    alt={featuredPost.author_name || (featuredPost.author && featuredPost.author.name)}
                                                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/10"
                                                />
                                                <div>
                                                    <p className="font-bold text-base">{featuredPost.author_name || (featuredPost.author && featuredPost.author.name)}</p>
                                                    <p className="text-xs text-muted-foreground">{featuredPost.author_role || (featuredPost.author && featuredPost.author.role)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Recent Posts Grid */}
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <div className="h-2 w-8 bg-primary rounded-full" />
                                        Latest Articles
                                    </h2>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recentPosts.map((post) => (
                                        <BlogCard key={post.slug} post={{
                                            ...post,
                                            coverImage: post.cover_image || post.coverImage,
                                            date: post.created_at || post.date,
                                            readingTime: post.reading_time || post.readingTime,
                                            author: post.author || {
                                                name: post.author_name,
                                                avatar: post.author_avatar,
                                                role: post.author_role
                                            }
                                        } as any} />
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {/* Newsletter CTA */}
                    <section className="py-16 md:py-24">
                        <div className="bg-primary text-primary-foreground rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl animate-pulse" />

                            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Stay ahead of the curve</h2>
                                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                                    Get the latest rental tips, exclusive offers, and market insights delivered straight to your inbox.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/10 p-2 rounded-3xl backdrop-blur-sm border border-white/20">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-transparent border-none text-white placeholder:text-primary-foreground/60 focus-visible:ring-0 h-14 text-lg px-6"
                                    />
                                    <Button variant="secondary" className="whitespace-nowrap font-extrabold h-14 px-8 rounded-2xl shadow-xl shadow-black/10">
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
