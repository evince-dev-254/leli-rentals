import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { firebaseStorageService } from './firebase-storage-service'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  location?: string
  bio?: string
  website?: string
  updatedAt: Date
}

export interface UpdateProfileResult {
  success: boolean
  error?: string
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
   * Update user profile image
   */
  async updateProfileImage(userId: string, file: File): Promise<UpdateProfileResult> {
    try {
      if (!db) {
        throw new Error('Firebase Firestore not initialized')
      }

      // Upload image to Firebase Storage
      const uploadResult = await firebaseStorageService.uploadUserProfileImage(userId, file)
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload image')
      }

      // Update user profile in Firestore
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        avatar: uploadResult.url,
        updatedAt: new Date()
      })

      return {
        success: true
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
   * Update user profile information
   */
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UpdateProfileResult> {
    try {
      if (!db) {
        throw new Error('Firebase Firestore not initialized')
      }

      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      })

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
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!db) {
        throw new Error('Firebase Firestore not initialized')
      }

      const userRef = doc(db, 'users', userId)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          id: userId,
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          website: data.website || '',
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }

      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  /**
   * Delete user profile image
   */
  async deleteProfileImage(userId: string, currentAvatarUrl?: string): Promise<UpdateProfileResult> {
    try {
      if (!db) {
        throw new Error('Firebase Firestore not initialized')
      }

      // Delete image from Firebase Storage if URL exists
      if (currentAvatarUrl) {
        const fileName = firebaseStorageService.extractFileNameFromUrl(currentAvatarUrl)
        if (fileName) {
          await firebaseStorageService.deleteUserProfileImage(userId, fileName)
        }
      }

      // Update user profile to remove avatar
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        avatar: null,
        updatedAt: new Date()
      })

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
