"use server"

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import { sendNewListingEmail, sendNewMessageEmail } from './email-actions';


/** Fetch data for the Owner dashboard */
export async function getOwnerData(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', userId);
    if (error) throw error;
    return data;
}

/** Fetch detailed stats for Owner Dashboard */
export async function getOwnerStats(userId: string) {
    const supabase = await createClient()
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

    // Get total withdrawn for balance calculation
    const { data: payouts } = await supabase
        .from('payout_requests')
        .select('amount')
        .eq('user_id', userId)
        .in('status', ['pending', 'approved', 'paid']);

    const totalWithdrawn = payouts?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

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
        availableBalance: totalEarnings - totalWithdrawn,
        totalWithdrawn,
        totalViews
    };
}

/** Fetch bookings for a user (either as renter or owner) */
export async function getBookings(userId: string, role: 'owner' | 'renter' = 'owner') {
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    return data.map((conv: any) => {
        const isP1 = conv.participant_1_id === userId;
        const otherUser = isP1 ? conv.participant2 : conv.participant1;
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
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

/** Send a message (Wrapper for sendMessageWithLookup) */
export async function sendMessage(conversationId: string, senderId: string, content: string) {
    return sendMessageWithLookup(conversationId, senderId, content);
}

/** Helper to send message with receiver lookup */
export async function sendMessageWithLookup(conversationId: string, senderId: string, content: string) {
    const supabase = await createClient()
    // 1. Get conversation to find receiver
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('participant_1_id, participant_2_id, listing_id')
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

    // --- TRIGGER NOTIFICATION & EMAIL ---
    try {
        // 1. Get sender and receiver profiles for content
        const { data: profiles } = await supabase
            .from('user_profiles')
            .select('id, full_name, email')
            .in('id', [senderId, receiverId]);

        const sender = profiles?.find(p => p.id === senderId);
        const receiver = profiles?.find(p => p.id === receiverId);

        // 2. Get listing title if possible
        const { data: listing } = await supabase
            .from('listings')
            .select('title')
            .eq('id', conv.listing_id)
            .single();

        // 3. Create in-app notification
        await createNotification(receiverId, {
            type: 'new_message',
            title: 'New Message',
            message: `You have a new message from ${sender?.full_name || 'a user'}`,
            action_url: `/messages`,
            metadata: { conversation_id: conversationId, sender_id: senderId }
        });

        // 4. Send email notification
        if (receiver?.email) {
            await sendNewMessageEmail(
                receiver.email,
                receiver.full_name?.split(' ')[0] || 'User',
                sender?.full_name || 'Someone',
                content,
                listing?.title
            );
        }
    } catch (triggerError) {
        console.error("Failed to trigger message notifications:", triggerError);
        // We don't throw here to avoid failing the message send if notification fails
    }

    return data;
}

/** Create a notification for a user */
export async function createNotification(userId: string, data: {
    type: string,
    title: string,
    message: string,
    action_url?: string,
    metadata?: any
}) {
    const supabase = getAdminSupabase() // Use admin for reliable insert
    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            ...data,
            is_read: false
        });

    if (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
}


/** Helper to get Supabase Admin client (Service Role) */
function getAdminSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get(name: string) {
                    return undefined
                },
            },
        }
    )
}

/** Fetch verification documents */
export async function getVerifications(userId: string) {
    const supabase = await createClient()

    // Security Check: Ensure the requester is the user themselves
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log(`[DEBUG] getVerifications: Requested for userId=${userId}`)
    console.log(`[DEBUG] getVerifications: Auth User ID=${user?.id}, Error=${authError?.message}`)

    if (authError || !user || user.id !== userId) {
        // If not the user, check if admin (optional, for safety we can just allow self-read here)
        // For strict security, we only allow self-read or admin-read.
        // Let's assume for this specific action it's for the dashboard user.
        if (user?.id !== userId) {
            console.error(`[DEBUG] Unauthorized verification fetch attempt. ServerUser: ${user?.id}, Target: ${userId}`)
            return []
        }
    }

    // Use Admin Client to bypass potential RLS issues with the table
    const adminSupabase = getAdminSupabase()

    const { data, error } = await adminSupabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

/** Upload a verification document record (file upload handled separately) */
export async function uploadVerification(userId: string, frontUrl: string, backUrl: string, selfieUrl: string, docType: string, documentNumber: string) {
    const supabase = getAdminSupabase() // Use Admin Client to bypass RLS
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

import { handleServerError, ActionResponse } from '../error-handler';

// ... (other imports)

/** Update user profile */
export async function updateProfile(userId: string, updates: any): Promise<ActionResponse> {
    try {
        const supabase = getAdminSupabase() // Use Admin Client to bypass RLS

        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .maybeSingle();

        if (error) return handleServerError(error, "Failed to update profile");

        return { success: true, data };
    } catch (error) {
        return handleServerError(error, "An unexpected error occurred while updating profile");
    }
}

/** Fetch data for the Affiliate dashboard */
export async function getAffiliateData(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found
    return data ? data : null;
}

/** Fetch referrals for an affiliate */
export async function getAffiliateReferrals(userId: string) {
    const supabase = await createClient()
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
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) throw error;
    return data;
}

/** Mark notification as read */
export async function markNotificationAsRead(notificationId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

    if (error) throw error;
}

/** Fetch data for the Admin dashboard */
export async function getAdminData() {
    const supabase = await createClient()
    const [usersRes, listingsRes] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }),
    ]);

    return {
        usersCount: usersRes.count || 0,
        listingsCount: listingsRes.count || 0,
    };
}

/** Fetch all data needed for the Admin Verifications Management panel */
export async function getAdminVerificationsAppData() {
    // 1. Verify User is an Admin before proceeding
    const authSupabase = await createClient()
    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data: profile } = await authSupabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required")
    }

    // 2. Use Admin Client to fetch all data bypassing RLS
    const adminSupabase = getAdminSupabase()

    const [docsRes, listingsRes] = await Promise.all([
        adminSupabase.from('verification_documents').select('*'),
        adminSupabase.from('listings').select('*').eq('status', 'pending')
    ])

    if (docsRes.error) throw docsRes.error
    if (listingsRes.error) throw listingsRes.error

    const docs = docsRes.data || []
    const listings = listingsRes.data || []

    // 3. Collect all user IDs from docs and listings
    const userIds = Array.from(new Set([
        ...docs.map(d => d.user_id),
        ...listings.map(l => l.owner_id)
    ]))

    // 4. Fetch profiles for these users
    let users = []
    if (userIds.length > 0) {
        const { data, error: usersError } = await adminSupabase
            .from('user_profiles')
            .select('*')
            .in('id', userIds)

        if (usersError) throw usersError
        users = data || []
    }

    return {
        docs,
        listings,
        users
    }
}

/** Fetch all users for Admin User Management bypassing RLS */
export async function getAdminUsersData() {
    const authSupabase = await createClient()
    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data: profile } = await authSupabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required")
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
        .from("user_profiles")
        .select(`
            *,
            referrer:referred_by (
                full_name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error
    return data || []
}

/** Fetch all listings for Admin Listing Management bypassing RLS */
export async function getAdminListingsData() {
    const authSupabase = await createClient()
    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data: profile } = await authSupabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required")
    }

    const adminSupabase = getAdminSupabase()
    const { data: listings, error: lsErr } = await adminSupabase.from("listings").select("*")
    if (lsErr) throw lsErr

    const ownerIds = Array.from(new Set((listings || []).map((l: any) => l.owner_id).filter(Boolean)))

    let users: any[] = [];
    if (ownerIds.length > 0) {
        const { data, error: usErr } = await adminSupabase
            .from("user_profiles")
            .select("id, full_name, avatar_url, email")
            .in("id", ownerIds);

        if (usErr) throw usErr
        users = data || [];
    }

    return {
        listings: listings || [],
        users
    }
}

/** Fetch a single verification document and related user data bypassing RLS */
export async function getAdminVerificationDetail(docId: string) {
    const authSupabase = await createClient()
    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data: profile } = await authSupabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required")
    }

    const adminSupabase = getAdminSupabase()

    const { data: doc, error: docError } = await adminSupabase
        .from("verification_documents")
        .select("*")
        .eq("id", docId)
        .single()

    if (docError) throw docError
    if (!doc) throw new Error("Document not found")

    const { data: userData, error: userError } = await adminSupabase
        .from("user_profiles")
        .select("*")
        .eq("id", doc.user_id)
        .single()

    if (userError) throw userError

    return {
        doc,
        user: userData
    }
}

/** Fetch all summary data for the Admin Dashboard bypassing RLS */
export async function getAdminDashboardData() {
    const authSupabase = await createClient()
    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data: profile } = await authSupabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required")
    }

    const adminSupabase = getAdminSupabase()

    // 1. Fetch Counts
    const [
        { count: totalUsers },
        { count: totalOwners },
        { count: totalAffiliates },
        { count: activeListings },
        { count: totalBookings },
        { count: totalReviews }
    ] = await Promise.all([
        adminSupabase.from("user_profiles").select("id", { count: "exact", head: true }),
        adminSupabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "owner"),
        adminSupabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "affiliate"),
        adminSupabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "approved"),
        adminSupabase.from("bookings").select("id", { count: "exact", head: true }),
        adminSupabase.from("reviews").select("id", { count: "exact", head: true }),
    ])

    // 2. Fetch Revenue
    const { data: revenueRows } = await adminSupabase.from("bookings").select("total_amount")
    const totalRevenue = (revenueRows || []).reduce((s: number, r: any) => s + Number(r.total_amount || 0), 0)

    // 3. Fetch Suspended and Pending (using simple heuristic for pending)
    const { data: suspended } = await adminSupabase.from("user_profiles").select("*").eq("account_status", "suspended").limit(10)

    // For pending verifications, we'll look for users with pending documents or owners/affiliates without approved docs
    const { data: pendingDocs } = await adminSupabase.from("verification_documents").select("user_id").eq("status", "pending")
    const pendingUserIds = Array.from(new Set((pendingDocs || []).map(d => d.user_id)))

    let pendingUsers: any[] = []
    if (pendingUserIds.length > 0) {
        const { data: pUsers } = await adminSupabase.from("user_profiles").select("*").in("id", pendingUserIds).limit(10)
        pendingUsers = (pUsers || []).map(u => ({
            id: u.id,
            fullName: u.full_name,
            email: u.email,
            avatarUrl: u.avatar_url,
            role: u.role,
            verificationStatus: 'submitted', // If they have a pending doc, it's submitted
            verificationDeadline: u.created_at ? new Date(new Date(u.created_at).getTime() + (7 * 24 * 60 * 60 * 1000)) : null // 7 days from signup as a shim
        }))
    }

    // Map suspended users as well
    const mappedSuspended = (suspended || []).map(u => ({
        id: u.id,
        fullName: u.full_name,
        email: u.email,
        avatarUrl: u.avatar_url,
        role: u.role
    }))

    // 4. Fetch Recent Activities
    const [
        { data: recentUsers },
        { data: recentListings },
        { data: recentBookings }
    ] = await Promise.all([
        adminSupabase.from('user_profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
        adminSupabase.from('listings').select('id, title, owner_id, created_at').order('created_at', { ascending: false }).limit(5),
        adminSupabase.from('bookings').select('id, listing_id, renter_id, created_at, total_amount').order('created_at', { ascending: false }).limit(5)
    ])

    const activities = [
        ...(recentUsers || []).map((u: any) => ({
            type: 'user',
            action: `New ${u.role} registration`,
            user: u.full_name || 'Unknown User',
            time: u.created_at,
            details: u.role
        })),
        ...(recentListings || []).map((l: any) => ({
            type: 'listing',
            action: 'New listing created',
            user: l.title,
            time: l.created_at,
            details: l.title
        })),
        ...(recentBookings || []).map((b: any) => ({
            type: 'booking',
            action: 'New booking',
            user: `Booking #${b.id.slice(0, 8)}`,
            time: b.created_at,
            details: `KSh ${b.total_amount}`
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

    return {
        stats: {
            totalUsers: totalUsers || 0,
            totalOwners: totalOwners || 0,
            totalAffiliates: totalAffiliates || 0,
            pendingVerifications: pendingUserIds.length,
            activeListings: activeListings || 0,
            totalBookings: totalBookings || 0,
            totalRevenue,
            suspendedAccounts: mappedSuspended.length,
            totalReviews: totalReviews || 0
        },
        pendingVerifications: pendingUsers,
        suspendedUsers: mappedSuspended,
        activities
    }
}


/** Create a new listing */
export async function createListing(ownerId: string, listingData: any) {
    console.log('Creating listing with data:', listingData);

    // Check if the creator is an admin to decide which client to use
    const baseSupabase = await createClient()
    const { data: profile } = await baseSupabase
        .from('user_profiles')
        .select('role')
        .eq('id', ownerId)
        .single()

    const isAdmin = profile?.role === 'admin'
    const supabase = isAdmin ? getAdminSupabase() : baseSupabase

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
    const supabase = await createClient()
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
    const transactions = (data || []).map((b: any) => ({
        id: b.id,
        type: 'earning',
        desc: b.listing?.title || 'Rental',
        date: new Date(b.end_date).toLocaleDateString(),
        amount: b.total_amount
    }));

    // Add affiliate referrals if user is an affiliate
    const { data: referrals } = await supabase
        .from('affiliate_referrals')
        .select(`
            id,
            commission_amount,
            created_at,
            listing:listings(title)
        `)
        .eq('affiliate_id', (await supabase.from('affiliates').select('id').eq('user_id', userId).single()).data?.id)
        .eq('status', 'paid');

    if (referrals) {
        const refTrans = referrals.map((r: any) => ({
            id: r.id,
            type: 'earning',
            desc: `Referral: ${r.listing?.title || 'Booking'}`,
            date: new Date(r.created_at).toLocaleDateString(),
            amount: r.commission_amount
        }));
        transactions.push(...refTrans);
    }

    // Add payouts to transaction history
    const { data: payouts } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (payouts) {
        const payoutTrans = payouts.map((p: any) => ({
            id: p.id,
            type: 'payout',
            desc: `Withdrawal (${p.status})`,
            date: new Date(p.created_at).toLocaleDateString(),
            amount: -p.amount
        }));
        transactions.push(...payoutTrans);
    }

    return transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Update Verification Document Status */
export async function updateDocumentStatus(docId: string, status: 'approved' | 'rejected', reason?: string) {
    const supabase = getAdminSupabase() // Use Admin Client to bypass RLS
    const updateData: any = { status };
    if (reason) updateData.rejection_reason = reason;

    const { error } = await supabase
        .from('verification_documents')
        .update(updateData)
        .eq('id', docId);

    if (error) throw error;
}

/** Find a user by email */
export async function getUserByEmail(email: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle to return null if not found instead of throwing

    if (error) throw error;
    return data; // Will be null if user not found
}

/** Fetch all admin users */
export async function getAdmins() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or('role.eq.admin,is_admin.eq.true');

    if (error) throw error;
    return data;
}
