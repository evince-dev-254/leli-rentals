"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, User, Loader2, Pin, ArrowLeft, MoreVertical, ShieldCheck, Clock, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getConversations, getMessages, sendMessage } from "@/lib/actions/dashboard-actions"
import { BackButton } from "@/components/ui/back-button"
import { MessageBubble } from "./message-bubble"
import { ChatInput } from "./chat-input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function MessagesPage() {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
    const [chats, setChats] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [loadingChats, setLoadingChats] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [pinnedChats, setPinnedChats] = useState<string[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom()
        }
    }, [messages])

    // Fetch conversations
    useEffect(() => {
        async function fetchChats() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setCurrentUser(user)
                if (user) {
                    const data = await getConversations(user.id)
                    setChats(data || [])
                }
            } catch (error) {
                console.error("Error fetching chats:", error)
            } finally {
                setLoadingChats(false)
            }
        }
        fetchChats()
    }, [])

    // Fetch messages when chat is selected
    useEffect(() => {
        if (!selectedChatId) return

        async function fetchMessages() {
            setLoadingMessages(true)
            try {
                const data = await getMessages(selectedChatId!)
                setMessages(data || [])
            } catch (error) {
                console.error("Error fetching messages:", error)
            } finally {
                setLoadingMessages(false)
            }
        }
        fetchMessages()

        // Realtime subscription
        const channel = supabase
            .channel(`conversation:${selectedChatId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${selectedChatId}`
            }, (payload) => {
                // Check if message is already in list (to avoid duplicates from optimistic updates)
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new]
                })
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [selectedChatId])

    const handleSendMessage = async (content: string, attachments?: string[]) => {
        if (!content.trim() && (!attachments || attachments.length === 0)) return
        if (!selectedChatId || !currentUser) return

        try {
            const tempId = 'temp-' + Date.now();
            const tempMessage = {
                id: tempId,
                content: content,
                sender_id: currentUser.id,
                created_at: new Date().toISOString(),
                is_read: false,
                attachments: attachments || []
            }

            // Optimistic update
            setMessages(prev => [...prev, tempMessage])

            await sendMessage(selectedChatId, currentUser.id, content, attachments)

        } catch (error) {
            console.error("Error sending message:", error)
        }
    }

    const togglePin = (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setPinnedChats(prev =>
            prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
        )
    }

    const filteredChats = chats
        .filter(chat =>
            chat.otherUser?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aPinned = pinnedChats.includes(a.id)
            const bPinned = pinnedChats.includes(b.id)
            if (aPinned && !bPinned) return -1
            if (!aPinned && bPinned) return 1
            return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
        })

    const selectedChat = chats.find(c => c.id === selectedChatId)
    const selectedChatUser = selectedChat?.otherUser

    return (
        <div className="flex w-full h-full bg-background relative overflow-hidden">
            {/* Background Decoration - Subtler and contained */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] opacity-50" />
            </div>

            {/* Chat List Sidebar */}
            <div className={cn(
                "w-full lg:w-96 flex flex-col bg-card/60 backdrop-blur-xl border-r border-border/40 z-10 transition-all duration-300 absolute lg:relative h-full",
                selectedChatId ? "hidden lg:flex" : "flex"
            )}>
                {/* Sidebar Header */}
                <div className="h-16 px-4 flex items-center justify-between border-b border-border/40 shrink-0 bg-card/40 backdrop-blur-sm">
                    <h2 className="text-lg font-bold tracking-tight">Messages</h2>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        {chats.filter(c => !c.lastMessage?.is_read && c.lastMessage?.sender_id !== currentUser?.id).length} New
                    </Badge>
                </div>

                {/* Search Bar */}
                <div className="p-3 border-b border-border/40 bg-card/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9 bg-background/50 border-white/10 focus:bg-background transition-all"
                        />
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto thin-scrollbar">
                    {loadingChats ? (
                        <div className="flex flex-col items-center justify-center p-8 gap-3 text-muted-foreground">
                            <Loader2 className="animate-spin h-6 w-6 text-primary" />
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground text-sm">No conversations found.</p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const isPinned = pinnedChats.includes(chat.id)
                            const lastMsg = chat.lastMessage
                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={cn(
                                        "relative p-4 cursor-pointer hover:bg-primary/5 transition-all border-b border-border/40",
                                        selectedChatId === chat.id ? "bg-primary/10 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className="relative shrink-0">
                                            <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-border/50 shadow-sm">
                                                <AvatarImage src={chat.otherUser?.avatar_url} />
                                                <AvatarFallback className="bg-secondary font-medium">
                                                    {chat.otherUser?.full_name?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            {chat.otherUser?.account_status === 'active' &&
                                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background ring-1 ring-border/20" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className={cn(
                                                    "font-medium truncate text-sm md:text-base",
                                                    selectedChatId === chat.id ? "text-primary" : "text-foreground"
                                                )}>
                                                    {chat.otherUser?.full_name || 'User'}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-muted-foreground shrink-0 ml-2">
                                                    {lastMsg ? new Date(lastMsg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <p className={cn(
                                                    "text-xs md:text-sm truncate flex-1",
                                                    !lastMsg?.is_read && lastMsg?.sender_id !== currentUser?.id
                                                        ? "font-bold text-foreground"
                                                        : "text-muted-foreground"
                                                )}>
                                                    {lastMsg?.content || 'Started a conversation'}
                                                </p>
                                                {isPinned && <Pin className="h-3 w-3 text-primary fill-primary shrink-0" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-card/30 z-0 h-full w-full",
                !selectedChatId ? "hidden lg:flex" : "flex fixed inset-0 lg:static z-50 bg-background lg:bg-transparent"
            )}>
                {selectedChatId ? (
                    <>
                        {/* Chat Header - Fixed Height, Always Visible */}
                        <div className="h-16 px-4 border-b border-border/40 flex items-center justify-between bg-card/80 backdrop-blur-xl shrink-0 sticky top-0 z-50">
                            <div className="flex items-center gap-3 w-full">
                                {/* Mobile Back Button - Explicit "Back" */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedChatId(null)}
                                    className="lg:hidden p-0 h-auto hover:bg-transparent -ml-2 mr-1 text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-1" />
                                    <span className="font-semibold text-sm">Chats</span>
                                </Button>

                                <div className="flex items-center gap-3 overflow-hidden flex-1">
                                    <Avatar className="h-8 w-8 md:h-10 md:w-10 border border-border/50 shrink-0">
                                        <AvatarImage src={selectedChatUser?.avatar_url} />
                                        <AvatarFallback>{selectedChatUser?.full_name?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col overflow-hidden min-w-0">
                                        <span className="font-bold text-sm md:text-base truncate">
                                            {selectedChatUser?.full_name || 'User'}
                                        </span>
                                        {selectedChatUser?.account_status === 'active' ? (
                                            <span className="text-[10px] md:text-xs text-green-500 font-medium flex items-center gap-1 truncate">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                                Active Now
                                            </span>
                                        ) : (
                                            <span className="text-[10px] md:text-xs text-muted-foreground/80 truncate">
                                                Offline
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-1 shrink-0">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 thin-scrollbar bg-gradient-to-b from-transparent to-black/5" style={{ scrollBehavior: 'smooth' }}>
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="animate-spin h-8 w-8 text-primary/50" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                                    <MessageBubble message={{ content: "👋", created_at: new Date().toISOString() } as any} isMe={false} />
                                    <p className="mt-4 text-sm text-muted-foreground">Say hello to start the conversation!</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            layout
                                        >
                                            <MessageBubble
                                                message={msg}
                                                isMe={msg.sender_id === currentUser?.id}
                                                sender={selectedChatUser}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                            <div ref={messagesEndRef} className="h-2" />
                        </div>

                        {/* Input Area - Fixed at Bottom */}
                        <div className="p-3 md:p-4 border-t border-border/40 bg-card/80 backdrop-blur-xl shrink-0 w-full z-50 pb-safe">
                            <ChatInput
                                onSendMessage={handleSendMessage}
                                disabled={loadingMessages}
                                placeholder="Type a message..."
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-card/10">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                            <MessageCircle className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">Select a Conversation</h2>
                        <p className="text-muted-foreground max-w-sm text-sm md:text-base leading-relaxed">
                            Choose a chat from the sidebar to start messaging.
                        </p>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 16px);
                }
            `}</style>
        </div>
    )
}
