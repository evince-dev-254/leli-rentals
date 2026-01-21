import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;
            return data;
        },
    });
}

export function useSubcategories(categoryId?: string) {
    return useQuery({
        queryKey: ['subcategories', categoryId],
        queryFn: async () => {
            if (!categoryId) return [];
            const { data, error } = await supabase
                .from('subcategories')
                .select('*')
                .eq('category_id', categoryId)
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!categoryId,
    });
}

export function useListings(categoryId?: string, searchTerm?: string, subcategoryId?: string) {
    return useQuery({
        queryKey: ['listings', categoryId, searchTerm, subcategoryId],
        queryFn: async () => {
            let query = supabase
                .from('listings')
                .select('*, owner:user_profiles(full_name, avatar_url), categories(name)')
                .in('status', ['active', 'Active', 'published', 'Published', 'approved', 'Approved'])
                .order('created_at', { ascending: false });

            if (categoryId) {
                query = query.eq('category_id', categoryId);
            }

            if (subcategoryId) {
                query = query.eq('subcategory_id', subcategoryId);
            }

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            const { data, error } = await query.limit(20);

            if (error) throw error;
            return data;
        },
    });
}

export function useListingDetail(id: string) {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('listings')
                .select('*, owner:user_profiles(*), categories(*)')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
    });
}

export function useUserStats(userId: string) {
    return useQuery({
        queryKey: ['user-stats', userId],
        queryFn: async () => {
            // This is a simplified version, ideally these would be calculated or fetched from a view
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            const { count: listingCount } = await supabase
                .from('listings')
                .select('*', { count: 'exact', head: true })
                .eq('owner_id', userId);

            const { count: bookingCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('renter_id', userId);

            return {
                profile,
                listingCount: listingCount || 0,
                bookingCount: bookingCount || 0,
            };
        },
        enabled: !!userId,
    });
}

export function useOwnerListings(userId: string) {
    return useQuery({
        queryKey: ['owner-listings', userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('listings')
                .select('*, owner:user_profiles(*), categories(*)')
                .eq('owner_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
}

export function useConversations(userId: string) {
    return useQuery({
        queryKey: ['conversations', userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    listing:listings(title, images),
                    participant1:user_profiles!participant_1_id(full_name, avatar_url, account_status),
                    participant2:user_profiles!participant_2_id(full_name, avatar_url, account_status),
                    last_message:messages(content, created_at, is_read, sender_id, attachments)
                `)
                .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
                .order('last_message_at', { ascending: false });

            if (error) throw error;

            // Process to clean up the structure for easier consumption
            return data.map((conv: any) => {
                const isP1 = conv.participant_1_id === userId;
                const otherUser = isP1 ? conv.participant2 : conv.participant1;
                // last_message is returned as an array or single object depending on relation type, usually array for 1:Many but here we want the latest.
                // Actually the query above does NOT limit messages. 
                // We should rely on Supabase returning the relation. 
                // However, without a dedicated limit/order in the nested select, it might pull all.
                // Ideally we'd use a view or better query, but for now we follow the web pattern.
                // The web pattern used: last_message:messages(content, ...).
                // Let's assume it grabs recent ones or the relationship is 1:1 in the view (it's not).
                // Correction: The web action acts on a "conversations" table which might have many messages.
                // The web code does `last_message:messages(...)`.

                const lastMsg = Array.isArray(conv.last_message)
                    ? conv.last_message.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                    : conv.last_message;

                return {
                    ...conv,
                    otherUser,
                    lastMessage: lastMsg
                };
            });
        },
        enabled: !!userId,
        refetchInterval: 5000,
    });
}

export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        },
    });
}

export async function sendMessage(conversationId: string, senderId: string, content: string, receiverId: string) {
    // 1. Insert message
    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            receiver_id: receiverId,
            content: content,
        })
        .select()
        .single();

    if (error) throw error;

    // 2. Update conversation timestamp
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

    return data;
}

export function useAffiliate(userId: string) {
    return useQuery({
        queryKey: ['affiliate', userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('affiliates')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
            return data;
        },
        enabled: !!userId,
    });
}
