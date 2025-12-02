import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
    createBooking,
    getRenterBookings,
    getOwnerBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    checkAvailability
} from '@/lib/bookings'

// Create a new booking
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { listingId, ownerId, startDate, endDate, pricePerDay, notes } = await request.json()

        if (!listingId || !ownerId || !startDate || !endDate || !pricePerDay) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check availability
        const isAvailable = await checkAvailability(
            listingId,
            new Date(startDate),
            new Date(endDate)
        )

        if (!isAvailable) {
            return NextResponse.json(
                { success: false, error: 'Selected dates are not available' },
                { status: 400 }
            )
        }

        const result = await createBooking(
            listingId,
            userId,
            ownerId,
            new Date(startDate),
            new Date(endDate),
            pricePerDay,
            notes
        )

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true, booking: result.booking })
    } catch (error) {
        console.error('Error in bookings POST:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Get bookings
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const bookingId = searchParams.get('id')
        const type = searchParams.get('type') // 'renter' or 'owner'

        if (bookingId) {
            // Get specific booking
            const booking = await getBookingById(bookingId)

            if (!booking) {
                return NextResponse.json(
                    { success: false, error: 'Booking not found' },
                    { status: 404 }
                )
            }

            // Verify user has access to this booking
            if (booking.renter_id !== userId && booking.owner_id !== userId) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized' },
                    { status: 403 }
                )
            }

            return NextResponse.json({ success: true, booking })
        } else {
            // Get all bookings for user
            const bookings = type === 'owner'
                ? await getOwnerBookings(userId)
                : await getRenterBookings(userId)

            return NextResponse.json({ success: true, bookings })
        }
    } catch (error) {
        console.error('Error in bookings GET:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Update booking status
export async function PATCH(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { bookingId, status, action } = await request.json()

        if (!bookingId) {
            return NextResponse.json(
                { success: false, error: 'Booking ID is required' },
                { status: 400 }
            )
        }

        // Verify user has access to this booking
        const booking = await getBookingById(bookingId)
        if (!booking || (booking.renter_id !== userId && booking.owner_id !== userId)) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        if (action === 'cancel') {
            const { reason } = await request.json()
            const result = await cancelBooking(bookingId, reason)

            if (!result.success) {
                return NextResponse.json(
                    { success: false, error: result.error },
                    { status: 400 }
                )
            }
        } else if (status) {
            const result = await updateBookingStatus(bookingId, status)

            if (!result.success) {
                return NextResponse.json(
                    { success: false, error: result.error },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in bookings PATCH:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
