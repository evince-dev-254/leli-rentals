"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MessageCircle, Send, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMessages, type Conversation } from "@/lib/messages-context"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { BackButton } from "@/components/ui/back-button"

export function MessagesContent() {
  const { conversations, activeConversation, setActiveConversation, sendMessage, markAsRead } = useMessages()
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    }
    getCurrentUser()
  }, [])

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return
    sendMessage(activeConversation.id, newMessage)
    setNewMessage("")
  }

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv)
    markAsRead(conv.id)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="gradient-mesh min-h-screen py-4 md:py-8 px-2 md:px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card rounded-2xl overflow-hidden h-[calc(100vh-60px)] md:h-[calc(100vh-200px)] min-h-[500px]">
          <div className="flex h-full">
            {/* Conversations List */}
            <div
              className={cn(
                "w-full md:w-80 lg:w-96 border-r border-border flex flex-col",
                activeConversation && "hidden md:flex",
              )}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <BackButton href="/" label="" />
                  <h2 className="text-xl font-semibold">Messages</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No conversations yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        className={cn(
                          "w-full p-4 text-left hover:bg-secondary/50 transition-colors",
                          activeConversation?.id === conv.id && "bg-secondary",
                        )}
                        onClick={() => handleSelectConversation(conv)}
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conv.participantAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {conv.participantName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium truncate">{conv.participantName}</span>
                              <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessageTime)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{conv.listingTitle}</p>
                            <p className="text-sm truncate mt-1">{conv.lastMessage}</p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={cn("flex-1 flex flex-col", !activeConversation && "hidden md:flex")}>
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setActiveConversation(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeConversation.participantAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {activeConversation.participantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{activeConversation.participantName}</p>
                      <p className="text-sm text-muted-foreground">{activeConversation.listingTitle}</p>
                    </div>
                    <div className="relative h-10 w-14 overflow-hidden rounded">
                      <Image
                        src={activeConversation.listingImage || "/placeholder.svg"}
                        alt={activeConversation.listingTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {activeConversation.messages?.map((message) => (
                        <div
                          key={message.id}
                          className={cn("flex", message.senderId === currentUserId ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2",
                              message.senderId === currentUserId
                                ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                                : "bg-secondary text-foreground",
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={cn(
                                "text-xs mt-1",
                                message.senderId === currentUserId ? "text-white/70" : "text-muted-foreground",
                              )}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2 items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <span className="text-xl">😊</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 p-2 grid grid-cols-6 gap-1">
                          {["😊", "😂", "🥰", "😍", "🤩", "🤔", "🙄", "😴", "😋", "😎", "😭", "😤", "👍", "👎", "❤️", "🔥", "✨", "🙌", "👏", "🤌", "🤝", "🙏", "🚩", "✅"].map(emoji => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              className="h-8 w-8 p-0 text-lg"
                              onClick={() => setNewMessage(prev => prev + emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
