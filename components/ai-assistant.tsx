"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, X, MessageSquare, Loader2, Sparkles, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "assistant"
    content: string
}

interface AiAssistantProps {
    mode?: "widget" | "inline"
}

export function AiAssistant({ mode = "widget" }: AiAssistantProps) {
    const [isOpen, setIsOpen] = useState(mode === "inline")
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm your leli rentals assistant. How can I help you today?" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            // Scroll to bottom
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: "user", content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error("AI API Error:", errorData)
                throw new Error(errorData.details || errorData.error || "Failed to fetch response")
            }

            const data = await response.json()
            setMessages(prev => [...prev, { role: "assistant", content: data.content }])
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }])
        } finally {
            setIsLoading(false)
        }
    }

    if (mode === "inline") {
        return (
            <Card className="w-full h-[600px] shadow-2xl flex flex-col glass-card border-primary/20 overflow-hidden rounded-3xl">
                <CardHeader className="p-6 border-b bg-primary/5 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Leli AI Help</CardTitle>
                            <p className="text-sm text-muted-foreground">Always here to assist with your rentals</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 flex-1 overflow-hidden relative">
                    <div className="h-full overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex w-full mb-4",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "rounded-2xl px-4 py-3 max-w-[85%] text-base shadow-sm flex flex-col gap-2",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted text-foreground rounded-bl-none"
                                    )}
                                >
                                    {msg.content.split(/(https:\/\/wa\.me\/\d+)/g).map((part, i) => {
                                        if (part.match(/https:\/\/wa\.me\/\d+/)) {
                                            return (
                                                <Button
                                                    key={i}
                                                    asChild
                                                    size="sm"
                                                    className="mt-1 bg-green-600 hover:bg-green-700 text-white gap-2 h-9"
                                                >
                                                    <a href={part} target="_blank" rel="noopener noreferrer">
                                                        <Phone className="h-4 w-4" />
                                                        Chat on WhatsApp
                                                    </a>
                                                </Button>
                                            )
                                        }
                                        return <span key={i}>{part}</span>
                                    })}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl px-4 py-3 bg-muted text-muted-foreground rounded-bl-none flex items-center gap-2 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="font-medium">Leli is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-4 border-t bg-background/50 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="flex w-full gap-3">
                        <Input
                            placeholder="Type your question here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 h-12 rounded-xl focus-visible:ring-1 border-2"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={isLoading || !input.trim()}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        )
    }

    return (
        <>
            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-4 left-4 sm:bottom-6 sm:left-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110",
                    isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[70vh] sm:h-[500px] z-50 shadow-2xl flex flex-col animate-in slide-in-from-left-10 fade-in glass-card border-primary/20">
                    <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Leli AI Help</CardTitle>
                                <p className="text-xs text-muted-foreground">Ask me anything</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 overflow-hidden relative">
                        <div className="h-full overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex w-full mb-4",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "rounded-2xl px-4 py-2 max-w-[85%] text-sm shadow-sm flex flex-col gap-2",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted text-foreground rounded-bl-none"
                                        )}
                                    >
                                        {msg.content.split(/(https:\/\/wa\.me\/\d+)/g).map((part, i) => {
                                            if (part.match(/https:\/\/wa\.me\/\d+/)) {
                                                return (
                                                    <Button
                                                        key={i}
                                                        asChild
                                                        size="sm"
                                                        className="mt-1 bg-green-600 hover:bg-green-700 text-white gap-2 h-8"
                                                    >
                                                        <a href={part} target="_blank" rel="noopener noreferrer">
                                                            <Phone className="h-3 w-3" />
                                                            Chat on WhatsApp
                                                        </a>
                                                    </Button>
                                                )
                                            }
                                            return <span key={i}>{part}</span>
                                        })}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl px-4 py-2 bg-muted text-muted-foreground rounded-bl-none flex items-center gap-2 text-sm">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-background/50 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="flex w-full gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 focus-visible:ring-1"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    )
}
