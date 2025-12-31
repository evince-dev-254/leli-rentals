"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { sendMessageWithLookup } from "./actions/dashboard-actions"

export interface Message {
  id: string
  senderId: string
  receiverId: string
  listingId: string
  listingTitle: string
  content: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  listingId: string
  listingTitle: string
  listingImage: string
  messages: Message[]
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

interface MessagesContextType {
  conversations: Conversation[]
  activeConversation: Conversation | null
  setActiveConversation: (conversation: Conversation | null) => void
  sendMessage: (conversationId: string, content: string, receiverId?: string) => void
  startConversation: (
    ownerId: string,
    ownerName: string,
    ownerAvatar: string,
    listingId: string,
    listingTitle: string,
    listingImage: string,
    initialMessage: string,
  ) => void
  markAsRead: (conversationId: string) => void
  unreadTotal: number
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()

  const unreadTotal = conversations.reduce((total, conv) => total + conv.unreadCount, 0)

  const fetchConversations = useCallback(async (uid: string) => {
    try {
      const { data: convs, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1:user_profiles!participant_1_id(id, full_name, avatar_url),
          participant_2:user_profiles!participant_2_id(id, full_name, avatar_url),
          listing:listings(id, title, images),
          messages(id, content, created_at, sender_id, is_read)
        `)
        .or(`participant_1_id.eq.${uid},participant_2_id.eq.${uid}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedConversations: Conversation[] = convs.map((conv: any) => {
        const isParticipant1 = conv.participant_1?.id === uid
        const otherUser = isParticipant1 ? conv.participant_2 : conv.participant_1

        // Find last message and sort them
        const messages = conv.messages || []
        const lastMsg = messages.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]

        const unread = messages.filter((m: any) => m.sender_id !== uid && !m.is_read).length

        return {
          id: conv.id,
          participantId: otherUser?.id || "unknown",
          participantName: otherUser?.full_name || "Unknown User",
          participantAvatar: otherUser?.avatar_url,
          listingId: conv.listing?.id,
          listingTitle: conv.listing?.title || "Listing",
          listingImage: conv.listing?.images?.[0] || "",
          messages: messages.map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            receiverId: m.sender_id === uid ? "me" : "other",
            listingId: conv.listing?.id,
            listingTitle: conv.listing?.title,
            content: m.content,
            timestamp: new Date(m.created_at),
            read: m.is_read
          })).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
          lastMessage: lastMsg?.content || "No messages",
          lastMessageTime: lastMsg ? new Date(lastMsg.created_at) : new Date(),
          unreadCount: unread
        }
      })

      setConversations(formattedConversations)
    } catch (err) {
      console.error("Error fetching conversations:", err)
    }
  }, [])

  const setupSubscription = useCallback((uid: string) => {
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${uid}`
        },
        () => {
          fetchConversations(uid)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchConversations])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
        fetchConversations(user.id)
        setupSubscription(user.id)
      }
    }
    init()
  }, [fetchConversations, setupSubscription])

  const sendMessage = async (conversationId: string, content: string, receiverId?: string) => {
    if (!currentUserId) return

    let finalReceiverId = receiverId

    if (!finalReceiverId) {
      const conversation = conversations.find(c => c.id === conversationId)
      if (conversation) {
        finalReceiverId = conversation.participantId
      }
    }

    if (!finalReceiverId) {
      console.error("No receiver ID found for message")
      return
    }

    try {
      await sendMessageWithLookup(conversationId, currentUserId, content)

      // fetchConversations(currentUserId) is not strictly needed if subscription works, 
      // but we do it anyway for immediate feedback
      fetchConversations(currentUserId)
    } catch (err) {
      console.error("Error sending message:", err)
      toast.error("Failed to send message")
    }
  }

  const startConversation = async (
    ownerId: string,
    ownerName: string,
    ownerAvatar: string,
    listingId: string,
    listingTitle: string,
    listingImage: string,
    initialMessage: string,
  ) => {
    if (!currentUserId) {
      toast.error("You must be logged in to send messages")
      router.push("/sign-in")
      return
    }

    try {
      // Check existing
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .or(`and(participant_1_id.eq.${currentUserId},participant_2_id.eq.${ownerId}),and(participant_1_id.eq.${ownerId},participant_2_id.eq.${currentUserId})`)
        .single()

      let convId = existing?.id

      if (!convId) {
        // Create new
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            participant_1_id: currentUserId,
            participant_2_id: ownerId,
            listing_id: listingId
          })
          .select()
          .single()

        if (createError) throw createError
        convId = newConv.id
      }

      // Send initial message
      await sendMessage(convId, initialMessage, ownerId)

      // Refresh and set active
      await fetchConversations(currentUserId)

      const updatedConvs = await supabase
        .from('conversations') // Re-fetch to confirm
        .select('*')
        .eq('id', convId)

      // Just rely on fetchConversations update for now, but we want to navigate
      // We can force route to messages page where it will pick up the active conversation
      router.push('/messages')

    } catch (err) {
      console.error("Error starting conversation:", err)
      toast.error("Failed to start conversation")
    }
  }

  const markAsRead = async (conversationId: string) => {
    if (!currentUserId) return

    // Update local state
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c))

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUserId)
    } catch (err) {
      console.error("Error marking read:", err)
    }
  }

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        startConversation,
        markAsRead,
        unreadTotal,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider")
  }
  return context
}
