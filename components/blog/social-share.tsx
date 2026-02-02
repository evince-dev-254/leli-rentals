"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Linkedin, Twitter, Share2 } from "lucide-react"

interface SocialShareProps {
    slug: string
    title: string
}

export function SocialShare({ slug, title }: SocialShareProps) {
    const url = `https://www.leli.rentals/blog/${slug}`
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    const shareLinks = [
        {
            name: "Twitter",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: "hover:text-[#1DA1F2]",
        },
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:text-[#4267B2]",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:text-[#0077b5]",
        },
        {
            name: "WhatsApp",
            icon: ({ className }: { className?: string }) => (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 1h4a.5.5 0 0 0 1-1v-1a.5.5 0 0 0-1-1h-4a.5.5 0 0 0-1 1v1z" />
                </svg>
            ),
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: "hover:text-[#25D366]",
        },
    ]

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                })
            } catch (err) {
                console.error("Error sharing:", err)
            }
        }
    }

    return (
        <div className="flex flex-col gap-4 sticky top-24">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share</span>
                <div className="flex flex-row md:flex-col gap-2">
                    {shareLinks.map((link) => (
                        <Button
                            key={link.name}
                            variant="ghost"
                            size="icon"
                            className={`transition-colors ${link.color}`}
                            asChild
                        >
                            <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.name}`}>
                                <link.icon className="h-5 w-5" />
                            </a>
                        </Button>
                    ))}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden transition-colors hover:text-primary"
                        onClick={handleShare}
                        aria-label="Share options"
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
