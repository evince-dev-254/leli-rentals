"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, User, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getConversations, getMessages, sendMessage } from "@/lib/actions/dashboard-actions"
import { BackButton } from "@/components/ui/back-button"
import { DashboardWelcomeHeader } from "@/components/dashboard/dashboard-welcome-header"

export function MessagesPage() {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
    const [messageInput, setMessageInput] = useState("")
    const [chats, setChats] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [loadingChats, setLoadingChats] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
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

        // Optional: Set up realtime subscription here for new messages
        const channel = supabase
            .channel(`conversation:${selectedChatId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${selectedChatId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [selectedChatId])

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChatId || !currentUser) return

        try {
            const tempMessage = {
                id: 'temp-' + Date.now(),
                content: messageInput,
                sender_id: currentUser.id,
                created_at: new Date().toISOString(),
                is_read: false
            }

            // Optimistic update
            setMessages(prev => [...prev, tempMessage])
            setMessageInput("")

            await sendMessage(selectedChatId, currentUser.id, tempMessage.content)

        } catch (error) {
            console.error("Error sending message:", error)
        }
    }

    const selectedChatUser = chats.find(c => c.id === selectedChatId)?.otherUser

    return (
        <div className="container mx-auto py-4 md:py-8 px-2 sm:px-4 space-y-6 md:space-y-8 pb-20">
            <DashboardWelcomeHeader
                user={currentUser}
                subtitle="Stay connected with your renters and owners."
            />

            <div className="h-[calc(100vh-18rem)] flex flex-col md:flex-row gap-6">
                {/* Chat List - Hidden on mobile if chat selected */}
                <Card className={`glass-card w-full md:w-80 flex flex-col ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                    <CardHeader className="p-4 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <BackButton href="/dashboard" label="" />
                            <CardTitle className="text-xl">Messages</CardTitle>
                        </div>
                        <div className="relative mt-2">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search messages..." className="pl-8" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        {loadingChats ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
                        ) : chats.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No conversations yet</div>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={`p-4 border-b border-border/50 cursor-pointer hover:bg-secondary/20 transition-colors ${selectedChatId === chat.id ? "bg-primary/5" : ""
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <Avatar>
                                            <AvatarImage src={chat.otherUser?.avatar_url} />
                                            <AvatarFallback>{chat.otherUser?.full_name?.[0] || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-medium`}>
                                                    {chat.otherUser?.full_name || 'User'}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {chat.lastMessage ? new Date(chat.lastMessage.created_at).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                            <p className="text-sm truncate text-muted-foreground">
                                                {chat.listing?.title && <span className="font-semibold mr-1">[{chat.listing.title}]</span>}
                                                {chat.lastMessage?.content || 'No messages'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Chat Window - Hidden on mobile if no chat selected */}
                <Card className={`glass-card flex-1 flex flex-col ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                    {selectedChatId ? (
                        <>
                            <div className="p-4 border-b border-border/50 flex items-center gap-3">
                                <BackButton onClick={() => setSelectedChatId(null)} className="md:hidden mr-2" label="" />
                                <Avatar>
                                    <AvatarImage src={selectedChatUser?.avatar_url} />
                                    <AvatarFallback>{selectedChatUser?.full_name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{selectedChatUser?.full_name || 'User'}</h3>
                                    <div className="text-xs text-muted-foreground">
                                        {/* Online status */}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {loadingMessages ? (
                                    <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-10">No messages yet. Say hi!</div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = msg.sender_id === currentUser?.id
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className={`relative px-4 py-2 max-w-[80%] text-sm shadow-sm ${isMe
                                                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                                                        : 'bg-card border border-border/50 text-foreground rounded-2xl rounded-tl-sm'
                                                        }`}
                                                >
                                                    <p className="leading-relaxed">{msg.content}</p>
                                                    <div className={`text-[10px] mt-1 text-right select-none ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                                                        }`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t border-border/50">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button size="icon" onClick={handleSendMessage}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <User className="h-12 w-12 mb-4 opacity-50" />
                            <p>Select a chat to start messaging</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
