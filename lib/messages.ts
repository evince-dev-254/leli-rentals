import { createClient } from '@/lib/supabase/client'

export interface Message {
    id: string
    sender_id: string
    recipient_id: string
    listing_id: string | null
    content: string
    read: boolean
    created_at: string
    updated_at: string
}

export interface Conversation {
    user_id: string
    user_name: string
    user_avatar?: string
    last_message: string
    last_message_time: string
    unread_count: number
    listing_id?: string
}

/**
 * Send a message
 */
export async function sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    listingId?: string
): Promise<{ success: boolean; message?: Message; error?: string }> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('messages')
            .insert({
                sender_id: senderId,
                recipient_id: recipientId,
                content,
                listing_id: listingId || null
            })
            .select()
            .single()

        if (error) throw error

        return { success: true, message: data }
    } catch (error) {
        console.error('Error sending message:', error)
        return { success: false, error: 'Failed to send message' }
    }
}

/**
 * Get messages between two users
 */
export async function getConversation(
    userId: string,
    otherUserId: string
): Promise<Message[]> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
            .order('created_at', { ascending: true })

        if (error) throw error

        return data || []
    } catch (error) {
        console.error('Error fetching conversation:', error)
        return []
    }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string): Promise<Conversation[]> {
    try {
        const supabase = createClient()

        // Get all messages where user is sender or recipient
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Group messages by conversation partner
        const conversationsMap = new Map<string, Conversation>()

        for (const message of messages || []) {
            const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id

            if (!conversationsMap.has(otherUserId)) {
                // Count unread messages from this user
                const unreadCount = (messages || []).filter(
                    m => m.sender_id === otherUserId && m.recipient_id === userId && !m.read
                ).length

                conversationsMap.set(otherUserId, {
                    user_id: otherUserId,
                    user_name: 'User', // TODO: Fetch from Clerk
                    last_message: message.content,
                    last_message_time: message.created_at,
                    unread_count: unreadCount,
                    listing_id: message.listing_id
                })
            }
        }

        return Array.from(conversationsMap.values())
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return []
    }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
    userId: string,
    senderId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient()

        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('recipient_id', userId)
            .eq('sender_id', senderId)
            .eq('read', false)

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error marking messages as read:', error)
        return { success: false, error: 'Failed to mark messages as read' }
    }
}

/**
 * Get unread message count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
    try {
        const supabase = createClient()

        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', userId)
            .eq('read', false)

        if (error) throw error

        return count || 0
    } catch (error) {
        console.error('Error fetching unread count:', error)
        return 0
    }
}

/**
 * Subscribe to new messages in real-time
 */
export function subscribeToMessages(
    userId: string,
    callback: (message: Message) => void
) {
    const supabase = createClient()

    const channel = supabase
        .channel('messages')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `recipient_id=eq.${userId}`
            },
            (payload) => {
                callback(payload.new as Message)
            }
        )
        .subscribe()

    return channel
}
