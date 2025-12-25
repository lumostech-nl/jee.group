import { put, del } from '@vercel/blob'

/**
 * Vercel Blob storage configuration
 * Uses BLOB_READ_WRITE_TOKEN environment variable
 */

/**
 * Check if an image URL is from Vercel Blob (custom uploaded) or external (Google OAuth)
 */
export const isMinIOImage = (imageUrl: string): boolean => {
  if (!imageUrl) return false
  // Vercel Blob URLs typically start with https://[hash].public.blob.vercel-storage.com
  return imageUrl.includes('blob.vercel-storage.com') || imageUrl.includes('vercel-storage.com')
}

/**
 * Check if an image URL is from Google OAuth
 */
export const isGoogleImage = (imageUrl: string): boolean => {
  if (!imageUrl) return false
  return imageUrl.includes('googleusercontent.com') || imageUrl.includes('lh3.googleusercontent.com')
}

/**
 * Initialize blob storage (no-op for Vercel Blob, kept for compatibility)
 */
export const initMinIO = async () => {
  // Vercel Blob doesn't require initialization
  // This function is kept for API compatibility
  return
}

/**
 * Upload a custom user image to Vercel Blob storage
 * This handles user-uploaded profile images (as opposed to Google OAuth images)
 */
export const uploadToMinIO = async (
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  try {
    const objectName = `profiles/${Date.now()}-${fileName}`

    const blob = await put(objectName, file, {
      access: 'public',
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return blob.url
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error)
    throw error
  }
}

export const deleteFromMinIO = async (objectName: string): Promise<void> => {
  try {
    // Extract the blob URL or construct it from object name
    // If objectName is a full URL, use it directly
    if (objectName.startsWith('http')) {
      await del(objectName, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
    } else {
      // If it's just a path, we need to list and find the blob
      // For now, we'll assume it's a full URL or handle it differently
      console.warn('deleteFromMinIO called with path instead of URL:', objectName)
      throw new Error('deleteFromMinIO requires a full blob URL')
    }
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error)
    throw error
  }
}

/**
 * Upload blog media (images, videos, documents) to Vercel Blob storage
 */
export const uploadBlogMediaToMinIO = async (
  file: Buffer,
  fileName: string,
  mimeType: string,
  subfolder: string = 'uploads'
): Promise<string> => {
  try {
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const objectName = `${subfolder}/${timestamp}-${sanitizedFileName}`

    const blob = await put(objectName, file, {
      access: 'public',
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return blob.url
  } catch (error) {
    console.error('Error uploading blog media to Vercel Blob:', error)
    throw error
  }
}

/**
 * Delete blog media from Vercel Blob storage
 */
export const deleteBlogMediaFromMinIO = async (blobUrl: string): Promise<void> => {
  try {
    await del(blobUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (error) {
    console.error('Error deleting blog media from Vercel Blob:', error)
    throw error
  }
}

/**
 * Get media URL from object name (deprecated for Vercel Blob)
 * Vercel Blob returns full URLs directly, so this is mainly for compatibility
 */
export const getMediaUrl = (objectName: string): string => {
  // This function is less relevant for Vercel Blob since URLs are returned directly
  // But kept for backward compatibility
  return objectName
}
