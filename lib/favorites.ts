import { createClient } from '@/lib/supabase/client'

export interface Favorite {
    id: string
    user_id: string
    listing_id: string
    created_at: string
}

/**
 * Add a listing to user's favorites
 */
export async function addToFavorites(userId: string, listingId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient()

        const { error } = await supabase
            .from('favorites')
            .insert({
                user_id: userId,
                listing_id: listingId
            })

        if (error) {
            // Check if it's a duplicate error
            if (error.code === '23505') {
                return { success: false, error: 'Already in favorites' }
            }
            throw error
        }

        return { success: true }
    } catch (error) {
        console.error('Error adding to favorites:', error)
        return { success: false, error: 'Failed to add to favorites' }
    }
}

/**
 * Remove a listing from user's favorites
 */
export async function removeFromFavorites(userId: string, listingId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient()

        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId)

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error removing from favorites:', error)
        return { success: false, error: 'Failed to remove from favorites' }
    }
}

/**
 * Check if a listing is in user's favorites
 */
export async function isFavorite(userId: string, listingId: string): Promise<boolean> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('listing_id', listingId)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw error
        }

        return !!data
    } catch (error) {
        console.error('Error checking favorite status:', error)
        return false
    }
}

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(userId: string): Promise<Favorite[]> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data || []
    } catch (error) {
        console.error('Error fetching favorites:', error)
        return []
    }
}

/**
 * Get favorite count for a listing
 */
export async function getFavoriteCount(listingId: string): Promise<number> {
    try {
        const supabase = createClient()

        const { count, error } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('listing_id', listingId)

        if (error) throw error

        return count || 0
    } catch (error) {
        console.error('Error fetching favorite count:', error)
        return 0
    }
}
