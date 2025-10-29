import { supabase } from './supabase'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  location?: string
  bio?: string
  website?: string
  account_type?: 'renter' | 'owner'
  subscription_status?: 'free' | 'basic' | 'premium' | 'enterprise'
  is_verified?: boolean
  updated_at?: string
}

export interface UpdateProfileResult {
  success: boolean
  error?: string
  url?: string
}

export class UserProfileService {
  private static instance: UserProfileService

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService()
    }
    return UserProfileService.instance
  }

  /**
   * Update user profile image using Cloudinary URL
   */
  async updateProfileImage(userId: string, file: File): Promise<UpdateProfileResult> {
    try {
      // Use Cloudinary widget or direct upload
      // For now, we'll use Clerk's avatar which is already handled
      // This is a placeholder for custom avatar uploads
      
      console.log('Profile image update - using Clerk avatar instead')
      
      return {
        success: true,
        error: 'Please use Clerk to update your profile photo. Click "Open Advanced Avatar Manager" above.'
      }
    } catch (error) {
      console.error('Error updating profile image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed'
      }
    }
  }

  /**
   * Update user profile information in Supabase
   */
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UpdateProfileResult> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed'
      }
    }
  }

  /**
   * Get user profile from Supabase
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data || null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  /**
   * Get public user profile (for other users to view)
   */
  async getPublicProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name, avatar, bio, location, account_type, subscription_status, is_verified')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data || null
    } catch (error) {
      console.error('Error getting public profile:', error)
      return null
    }
  }

  /**
   * Delete user profile image
   */
  async deleteProfileImage(userId: string, currentAvatarUrl?: string): Promise<UpdateProfileResult> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          avatar: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      console.error('Error deleting profile image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      }
    }
  }
}

// Export singleton instance
export const userProfileService = UserProfileService.getInstance()
