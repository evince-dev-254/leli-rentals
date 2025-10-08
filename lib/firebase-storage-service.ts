import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export class FirebaseStorageService {
  private static instance: FirebaseStorageService

  public static getInstance(): FirebaseStorageService {
    if (!FirebaseStorageService.instance) {
      FirebaseStorageService.instance = new FirebaseStorageService()
    }
    return FirebaseStorageService.instance
  }

  /**
   * Upload user profile image to Firebase Storage
   */
  async uploadUserProfileImage(userId: string, file: File): Promise<UploadResult> {
    try {
      if (!storage) {
        throw new Error('Firebase Storage not initialized')
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, GIF, or WebP images.')
      }

      // Validate file size (2MB limit)
      const maxSize = 2 * 1024 * 1024 // 2MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload images smaller than 2MB.')
      }

      // Create a unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `profile_${userId}_${timestamp}.${fileExtension}`
      
      // Create storage reference
      const storageRef = ref(storage, `user-profiles/${userId}/${fileName}`)

      // Upload file
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        success: true,
        url: downloadURL
      }
    } catch (error) {
      console.error('Error uploading profile image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * Delete user profile image from Firebase Storage
   */
  async deleteUserProfileImage(userId: string, fileName: string): Promise<UploadResult> {
    try {
      if (!storage) {
        throw new Error('Firebase Storage not initialized')
      }

      const storageRef = ref(storage, `user-profiles/${userId}/${fileName}`)
      await deleteObject(storageRef)

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

  /**
   * Extract filename from download URL
   */
  extractFileNameFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      // Remove query parameters
      return fileName.split('?')[0]
    } catch (error) {
      console.error('Error extracting filename:', error)
      return null
    }
  }
}

// Export singleton instance
export const firebaseStorageService = FirebaseStorageService.getInstance()
