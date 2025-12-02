import { supabase } from '@/lib/supabase'

export interface Booking {
    id: string
    listing_id: string
    renter_id: string
    owner_id: string
    start_date: string
    end_date: string
    total_days: number
    price_per_day: number
    subtotal: number
    booking_fee: number
    total_price: number
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    payment_status: 'unpaid' | 'paid' | 'refunded'
    payment_method?: string
    payment_reference?: string
    notes?: string
    created_at: string
    updated_at: string
    cancelled_at?: string
    cancellation_reason?: string
}

export interface BookingCalculation {
    totalDays: number
    pricePerDay: number
    subtotal: number
    bookingFee: number
    totalPrice: number
}

/**
 * Calculate booking costs
 */
export function calculateBookingCosts(
    startDate: Date,
    endDate: Date,
    pricePerDay: number
): BookingCalculation {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Calculate total days
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Calculate costs
    const subtotal = totalDays * pricePerDay
    const bookingFee = Math.round(subtotal * 0.10 * 100) / 100 // 10% booking fee
    const totalPrice = subtotal + bookingFee

    return {
        totalDays,
        pricePerDay,
        subtotal,
        bookingFee,
        totalPrice
    }
}

/**
 * Create a new booking
 */
export async function createBooking(
    listingId: string,
    renterId: string,
    ownerId: string,
    startDate: Date,
    endDate: Date,
    pricePerDay: number,
    notes?: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {


        // Calculate costs
        const costs = calculateBookingCosts(startDate, endDate, pricePerDay)

        const { data, error } = await supabase
            .from('bookings')
            .insert({
                listing_id: listingId,
                renter_id: renterId,
                owner_id: ownerId,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                total_days: costs.totalDays,
                price_per_day: costs.pricePerDay,
                subtotal: costs.subtotal,
                booking_fee: costs.bookingFee,
                total_price: costs.totalPrice,
                notes
            })
            .select()
            .single()

        if (error) throw error

        return { success: true, booking: data }
    } catch (error) {
        console.error('Error creating booking:', error)
        return { success: false, error: 'Failed to create booking' }
    }
}

/**
 * Get user's bookings (as renter)
 */
export async function getRenterBookings(renterId: string): Promise<Booking[]> {
    try {


        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('renter_id', renterId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data || []
    } catch (error) {
        console.error('Error fetching renter bookings:', error)
        return []
    }
}

/**
 * Get owner's bookings (as owner)
 */
export async function getOwnerBookings(ownerId: string): Promise<Booking[]> {
    try {


        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('owner_id', ownerId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data || []
    } catch (error) {
        console.error('Error fetching owner bookings:', error)
        return []
    }
}

/**
 * Get booking by ID
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
    try {


        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single()

        if (error) throw error

        return data
    } catch (error) {
        console.error('Error fetching booking:', error)
        return null
    }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
    bookingId: string,
    status: Booking['status']
): Promise<{ success: boolean; error?: string }> {
    try {


        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId)

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error updating booking status:', error)
        return { success: false, error: 'Failed to update booking status' }
    }
}

/**
 * Cancel booking
 */
export async function cancelBooking(
    bookingId: string,
    reason?: string
): Promise<{ success: boolean; error?: string }> {
    try {


        const { error } = await supabase
            .from('bookings')
            .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString(),
                cancellation_reason: reason
            })
            .eq('id', bookingId)

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error cancelling booking:', error)
        return { success: false, error: 'Failed to cancel booking' }
    }
}

/**
 * Check if dates are available for a listing
 */
export async function checkAvailability(
    listingId: string,
    startDate: Date,
    endDate: Date
): Promise<boolean> {
    try {


        const { data, error } = await supabase
            .from('bookings')
            .select('id')
            .eq('listing_id', listingId)
            .in('status', ['pending', 'confirmed'])
            .or(`and(start_date.lte.${endDate.toISOString().split('T')[0]},end_date.gte.${startDate.toISOString().split('T')[0]})`)

        if (error) throw error

        // If no overlapping bookings found, dates are available
        return !data || data.length === 0
    } catch (error) {
        console.error('Error checking availability:', error)
        return false
    }
}
