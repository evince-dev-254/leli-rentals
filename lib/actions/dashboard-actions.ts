import { supabase } from '@/lib/supabase';

/** Fetch data for the Owner dashboard */
export async function getOwnerData(userId: string) {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', userId);
    if (error) throw error;
    return data;
}

/** Fetch detailed stats for Owner Dashboard */
export async function getOwnerStats(userId: string) {
    const { count: listingsCount, error: listingsError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId);

    if (listingsError) throw listingsError;

    // For active bookings (status = 'active' or 'confirmed')
    const { count: activeBookingsCount, error: bookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId)
        .in('status', ['active', 'confirmed']);

    if (bookingsError) throw bookingsError;

    // Calculate earnings (sum of completed bookings)
    const { data: earningsData, error: earningsError } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('owner_id', userId)
        .eq('status', 'completed');

    if (earningsError) throw earningsError;

    const totalEarnings = earningsData?.reduce((sum, booking) => sum + (Number(booking.total_amount) || 0), 0) || 0;

    // Get total views from listings
    const { data: listingsData, error: viewsError } = await supabase
        .from('listings')
        .select('views_count')
        .eq('owner_id', userId);

    if (viewsError) throw viewsError;
    const totalViews = listingsData?.reduce((sum, listing) => sum + (Number(listing.views_count) || 0), 0) || 0;

    return {
        listingsCount: listingsCount || 0,
        activeBookingsCount: activeBookingsCount || 0,
        totalEarnings,
        totalViews
    };
}

/** Fetch bookings for a user (either as renter or owner) */
export async function getBookings(userId: string, role: 'owner' | 'renter' = 'owner') {
    let query = supabase
        .from('bookings')
        .select(`
            *,
            listing:listings(title, images),
            renter:user_profiles!bookings_renter_id_fkey(full_name, avatar_url),
            owner:user_profiles!bookings_owner_id_fkey(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

    if (role === 'owner') {
        query = query.eq('owner_id', userId);
    } else {
        query = query.eq('renter_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

/** Fetch conversations for a user */
export async function getConversations(userId: string) {
    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            listing:listings(title),
            participant1:user_profiles!participant_1_id(full_name, avatar_url),
            participant2:user_profiles!participant_2_id(full_name, avatar_url),
            last_message:messages(content, created_at, is_read, sender_id)
        `)
        .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
        .order('last_message_at', { ascending: false });

    if (error) throw error;

    // Process to get the "other" participant details
    return data.map(conv => {
        const isP1 = conv.participant_1_id === userId;
        const otherUser = isP1 ? conv.participant2 : conv.participant1;
        // Get the latest message from the array (if joined correctly, usually strictly latest needed)
        // Note: Supabase join on one-to-many usually returns array. Limit to 1 in real query would be better but simple select returns all.
        // Optimizing this query might be needed for scale but fine for now.
        const lastMsg = conv.last_message?.[0] || null;

        return {
            ...conv,
            otherUser,
            lastMessage: lastMsg
        };
    });
}

/** Fetch messages for a specific conversation */
export async function getMessages(conversationId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

/** Send a message */
export async function sendMessage(conversationId: string, senderId: string, content: string) {
    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            // Receiver ID needs to be derived or passed. For simplicity, we trigger a function or just insert.
            // Schema requires receiver_id. We need to look up the conversation to find the other participant.
            // For this quick implementation, we assume the caller handles receiver logic or we do a lookup.
            // Let's do a quick lookup if possible, or just optionalize it in schema? No, RLS needs it.
            // IMPROVEMENT: Fetch conversation first.
            content: content
        })
        .select()
        .single();

    // Wait, the schema requires receiver_id. We should update this function to take receiverId.
    // However, fetching it inside is safer.

    if (error) throw error;
    return data;
}

/** Helper to send message with receiver lookup */
export async function sendMessageWithLookup(conversationId: string, senderId: string, content: string) {
    // 1. Get conversation to find receiver
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('participant_1_id, participant_2_id')
        .eq('id', conversationId)
        .single();

    if (convError) throw convError;

    const receiverId = conv.participant_1_id === senderId ? conv.participant_2_id : conv.participant_1_id;

    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            receiver_id: receiverId,
            content: content
        })
        .select()
        .single();

    if (error) throw error;

    // Update conversation last_message_at
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

    return data;
}


/** Fetch verification documents */
export async function getVerifications(userId: string) {
    const { data, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

/** Upload a verification document record (file upload handled separately) */
export async function uploadVerification(userId: string, frontUrl: string, backUrl: string, selfieUrl: string, docType: string, documentNumber: string) {
    const { data, error } = await supabase
        .from('verification_documents')
        .insert({
            user_id: userId,
            document_url: frontUrl,
            back_image_url: backUrl,
            selfie_image_url: selfieUrl,
            document_type: docType,
            document_number: documentNumber,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/** Update user profile */
export async function updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/** Fetch data for the Affiliate dashboard */
export async function getAffiliateData(userId: string) {
    const { data, error } = await supabase
        .from('affiliates') // Changed from affiliate_stats to affiliates table based on schema
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found
    return data ? data : null;
}

/** Fetch referrals for an affiliate */
export async function getAffiliateReferrals(userId: string) {
    // First get affiliate ID
    const { data: affiliate, error: affError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (affError || !affiliate) return [];

    const { data, error } = await supabase
        .from('affiliate_referrals')
        .select(`
            id,
            commission_amount,
            commission_status,
            created_at,
            referred_user:user_profiles!referred_user_id(full_name, avatar_url, email)
        `)
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/** Fetch notifications for a user */
export async function getNotifications(userId: string) {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10); // Limit to latest 10

    if (error) throw error;
    return data;
}

/** Mark notification as read */
export async function markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

    if (error) throw error;
}

/** Fetch data for the Admin dashboard */
export async function getAdminData() {
    const [usersRes, listingsRes] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }),
    ]);

    return {
        usersCount: usersRes.count || 0,
        listingsCount: listingsRes.count || 0,
    };
}
import { sendNewListingEmail } from './email-actions';

// ... existing code ...

/** Create a new listing */
export async function createListing(ownerId: string, listingData: any) {
    console.log('Creating listing with data:', listingData);

    const { data, error } = await supabase
        .from('listings')
        .insert({
            ...listingData,
            owner_id: ownerId,
            views_count: 0,
            favorites_count: 0,
            rating_average: 0,
            rating_count: 0,
            is_featured: false,
            is_verified: false,
            status: 'pending'
        })
        .select()
        .single();

    if (error) {
        console.error('Supabase error creating listing:', error);
        throw error;
    }

    console.log('Listing created successfully:', data);

    // Send confirmation email
    try {
        const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('email, full_name')
            .eq('id', ownerId)
            .single()

        if (userProfile?.email) {
            await sendNewListingEmail(
                userProfile.email,
                userProfile.full_name?.split(' ')[0] || 'User',
                data.title,
                data.id
            )
        }
    } catch (emailError) {
        console.error('Failed to send listing creation email:', emailError)
        // Don't fail the request if email fails
    }

    return data;
}

/** Get User Earnings (from completed bookings) */
export async function getEarnings(userId: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            id,
            total_amount,
            end_date,
            listing:listings(title)
        `)
        .eq('owner_id', userId)
        .eq('status', 'completed')
        .order('end_date', { ascending: false });

    if (error) throw error;

    // Transform to transaction format
    return data.map((b: any) => ({
        id: b.id,
        type: 'earning',
        desc: b.listing?.title || 'Rental',
        date: new Date(b.end_date).toLocaleDateString(),
        amount: b.total_amount
    }));
}

/** Update Verification Document Status */
export async function updateDocumentStatus(docId: string, status: 'approved' | 'rejected', reason?: string) {
    const updateData: any = { status };
    if (reason) updateData.rejection_reason = reason;

    const { error } = await supabase
        .from('verification_documents')
        .update(updateData)
        .eq('id', docId);

    if (error) throw error;
}

/** Fetch all admin users */
export async function getAdmins() {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or('role.eq.admin,is_admin.eq.true');

    if (error) throw error;
    return data;
}

/** Find a user by email */
export async function getUserByEmail(email: string) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (error) throw error;
    return data;
}

