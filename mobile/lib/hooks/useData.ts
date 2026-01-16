import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            return data;
        },
    });
}

export function useListings(categoryId?: string, searchTerm?: string) {
    return useQuery({
        queryKey: ['listings', categoryId, searchTerm],
        queryFn: async () => {
            let query = supabase
                .from('listings')
                .select('*, owner:user_profiles(full_name, avatar_url)')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (categoryId) {
                query = query.eq('category_id', categoryId);
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
