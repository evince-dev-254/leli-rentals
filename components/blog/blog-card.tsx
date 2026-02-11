import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BlogPost } from "@/lib/blog-data"
import { Clock, Star } from "lucide-react"

interface BlogCardProps {
    post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Badge className="absolute top-4 left-4 z-10" variant="secondary">
                        {post.category}
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(post.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readingTime}</span>
                        </div>
                    </div>
                    {(post as any).average_rating > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-yellow-600" />
                            <span>{(post as any).average_rating.toFixed(1)} ({(post as any).review_count})</span>
                        </div>
                    )}
                </div>
                <h3 className="line-clamp-2 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                <CardContent className="p-6 pt-0">
                    <p className="line-clamp-3 text-muted-foreground text-sm">
                        {post.excerpt}
                    </p>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium">{post.author.name}</span>
                        <span className="text-[10px] text-muted-foreground">{post.author.role}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
