"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from "@/components/ui/context-menu"
import { Copy, Forward, Pin, Trash2, Download, FileText } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
    message: {
        id: string
        content: string
        sender_id: string
        created_at: string
        is_read: boolean
    }
    isMe: boolean
    sender?: {
        full_name: string
        avatar_url?: string
    }
}

export function MessageBubble({ message, isMe, sender }: MessageBubbleProps) {
    const [isHovered, setIsHovered] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content)
        toast.success("Message copied to clipboard")
    }

    const handleForward = () => {
        toast.info("Forwarding feature coming soon!")
    }

    const handlePin = () => {
        toast.info("Pinning feature coming soon!")
    }

    const handleDownload = () => {
        toast.info("Download feature coming soon!")
    }

    return (
        <div
            className={cn(
                "flex w-full mb-4 group",
                isMe ? "justify-end" : "justify-start"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cn(
                "flex max-w-[80%] md:max-w-[70%] gap-2",
                isMe ? "flex-row-reverse" : "flex-row"
            )}>
                {!isMe && (
                    <Avatar className="h-8 w-8 mt-auto shrink-0 ring-1 ring-white/10 shadow-lg">
                        <AvatarImage src={sender?.avatar_url} />
                        <AvatarFallback className="text-[10px] bg-secondary">
                            {sender?.full_name?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                )}

                <div className="flex flex-col gap-1">
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <div
                                className={cn(
                                    "relative px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-300",
                                    isMe
                                        ? "bg-gradient-to-tr from-primary to-purple-600 text-primary-foreground rounded-tr-none border border-white/10"
                                        : "bg-white/5 backdrop-blur-md border border-white/10 text-foreground rounded-tl-none hover:bg-white/10"
                                )}
                            >
                                {message.content && (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words mb-2">{message.content}</p>
                                )}

                                {message.attachments && message.attachments.length > 0 && (
                                    <div className="flex flex-col gap-2 mb-2">
                                        {message.attachments.map((url: string, i: number) => {
                                            const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)/i)
                                            return (
                                                <div key={i} className="rounded-lg overflow-hidden border border-white/10 bg-white/5 max-w-[200px]">
                                                    {isImage ? (
                                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                                            <img src={url} alt="attachment" className="w-full h-auto object-cover hover:opacity-90 transition-opacity" />
                                                        </a>
                                                    ) : (
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 p-3 text-xs hover:bg-white/10 transition-colors"
                                                        >
                                                            <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
                                                                <FileText className="h-4 w-4" />
                                                            </div>
                                                            <span className="truncate max-w-[120px]">Document {i + 1}</span>
                                                            <Download className="h-3 w-3 ml-auto opacity-50" />
                                                        </a>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                <div className={cn(
                                    "text-[9px] mt-1.5 flex items-center justify-end gap-1 select-none",
                                    isMe ? "text-primary-foreground/60" : "text-muted-foreground/60"
                                )}>
                                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && (
                                        <span className="ml-1 opacity-80">
                                            {message.is_read ? "✓✓" : "✓"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-48 bg-background/95 backdrop-blur-md border-white/10">
                            <ContextMenuItem onClick={handleCopy} className="gap-2 focus:bg-primary/20">
                                <Copy className="h-4 w-4" /> Copy Message
                            </ContextMenuItem>
                            <ContextMenuItem onClick={handleForward} className="gap-2 focus:bg-primary/20">
                                <Forward className="h-4 w-4" /> Forward
                            </ContextMenuItem>
                            <ContextMenuItem onClick={handlePin} className="gap-2 focus:bg-primary/20">
                                <Pin className="h-4 w-4" /> Pin Chat
                            </ContextMenuItem>
                            <ContextMenuItem onClick={handleDownload} className="gap-2 focus:bg-primary/20">
                                <Download className="h-4 w-4" /> Download
                            </ContextMenuItem>
                            {isMe && (
                                <ContextMenuItem className="gap-2 text-red-500 focus:bg-red-500/10">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </ContextMenuItem>
                            )}
                        </ContextMenuContent>
                    </ContextMenu>
                </div>
            </div>
        </div>
    )
}
