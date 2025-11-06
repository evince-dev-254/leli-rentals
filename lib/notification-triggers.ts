import { supabase } from './supabase'

export interface NotificationPayload {
  user_id: string
  type: string
  title: string
  message?: string
  link?: string
}

export const notificationTriggers = {
  /**
   * Trigger a notification when a new booking is made
   */
  async triggerBookingNotification(
    ownerId: string,
    listingTitle: string,
    renterName: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: ownerId,
        type: 'booking',
        title: 'New Booking Request',
        message: `${renterName} has requested to book "${listingTitle}"`,
        link: '/dashboard/owner',
        read: false,
      })

      if (error) throw error
      console.log('Booking notification sent')
    } catch (error) {
      console.error('Error triggering booking notification:', error)
    }
  },

  /**
   * Trigger a notification when someone favorites a listing
   */
  async triggerFavoriteNotification(
    ownerId: string,
    userName: string,
    listingTitle: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: ownerId,
        type: 'favorite',
        title: 'New Favorite',
        message: `${userName} added "${listingTitle}" to their favorites`,
        link: '/dashboard/owner',
        read: false,
      })

      if (error) throw error
      console.log('Favorite notification sent')
    } catch (error) {
      console.error('Error triggering favorite notification:', error)
    }
  },

  /**
   * Trigger a welcome notification for new users
   */
  async triggerWelcomeNotification(
    userId: string,
    userName: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type: 'welcome',
        title: `Welcome ${userName}!`,
        message:
          'Thank you for joining our rental platform. Start exploring amazing rentals or list your first item!',
        link: '/get-started',
        read: false,
      })

      if (error) throw error
      console.log('Welcome notification sent')
    } catch (error) {
      console.error('Error triggering welcome notification:', error)
    }
  },

  /**
   * Trigger a notification for new messages
   */
  async triggerMessageNotification(
    recipientId: string,
    senderName: string,
    conversationId?: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: recipientId,
        type: 'message',
        title: 'New Message',
        message: `You have a new message from ${senderName}`,
        link: conversationId ? `/messages?conversation=${conversationId}` : '/messages',
        read: false,
      })

      if (error) throw error
      console.log('Message notification sent')
    } catch (error) {
      console.error('Error triggering message notification:', error)
    }
  },

  /**
   * Trigger a notification when verification status changes
   */
  async triggerVerificationNotification(
    userId: string,
    status: 'approved' | 'rejected',
    message?: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type: 'verification',
        title:
          status === 'approved'
            ? 'Verification Approved ✓'
            : 'Verification Needs Attention',
        message:
          message ||
          (status === 'approved'
            ? 'Your account has been verified! You can now create listings.'
            : 'Your verification needs attention. Please review and resubmit.'),
        link: status === 'approved' ? '/list-item' : '/dashboard/owner/verification',
        read: false,
      })

      if (error) throw error
      console.log('Verification notification sent')
    } catch (error) {
      console.error('Error triggering verification notification:', error)
    }
  },

  /**
   * Trigger a notification for listing status changes
   */
  async triggerListingStatusNotification(
    userId: string,
    listingTitle: string,
    status: 'published' | 'archived'
  ): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type: 'listing_status',
        title:
          status === 'published'
            ? 'Listing Published'
            : 'Listing Archived',
        message:
          status === 'published'
            ? `"${listingTitle}" is now live and visible to renters!`
            : `"${listingTitle}" has been archived and is no longer visible.`,
        link: '/dashboard/owner',
        read: false,
      })

      if (error) throw error
      console.log('Listing status notification sent')
    } catch (error) {
      console.error('Error triggering listing status notification:', error)
    }
  },

  /**
   * Generic notification trigger
   */
  async triggerNotification(payload: NotificationPayload): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: payload.user_id,
        type: payload.type,
        title: payload.title,
        message: payload.message || null,
        link: payload.link || null,
        read: false,
      })

      if (error) throw error
      console.log('Notification sent:', payload.title)
    } catch (error) {
      console.error('Error triggering notification:', error)
    }
  },
}

