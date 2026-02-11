import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BlogPost } from "@/lib/blog-data"
import { ChevronLeft, Clock, Calendar } from "lucide-react"

interface BlogHeroProps {
    post: BlogPost
}

export function BlogHero({ post }: BlogHeroProps) {
    return (
        <div className="relative min-h-[60vh] flex flex-col justify-end pb-12 pt-32 px-4 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/30" />
                <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
            </div>

            <div className="container relative z-10 mx-auto max-w-4xl">
                {/* Breadcrumb */}
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Blog
                </Link>

                <div className="space-y-6">
                    <Badge className="px-4 py-1.5 text-base">{post.category}</Badge>

                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-balance text-foreground shadow-sm">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10 border-2 border-background">
                                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">{post.author.name}</span>
                                <span className="text-xs">{post.author.role}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{post.readingTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
