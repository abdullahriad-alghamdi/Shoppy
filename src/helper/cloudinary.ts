import { v2 as cloudinary } from 'cloudinary'
import { createHTTPError } from '../utils/createError'

cloudinary.config({
  cloud_name: 'dasw4jtcc',
  api_key: '158427295456332',
  api_secret: '4BwJp9CujFR0uYoUOwdr7MBaxVk',
})

export const uploadToCloudinary = async (image: string, folderName: string): Promise<string> => {
  const response = await cloudinary.uploader.upload(image, {
    folder: folderName,
  })
  return response.secure_url
}

export const valueWithoutExtension = async (imageUrl: string): Promise<string> => {
  // Split the URL by slashes to get an array of path segments
  const pathSegments = imageUrl.split('/')

  // Get the last segment
  const lastSegment = pathSegments[pathSegments.length - 1]
  let valueWithoutExtension = ''
  // Remove the file extension (.jpg or png jpeg ) from the last segment
  if (lastSegment.includes('.')) {
    valueWithoutExtension = lastSegment.split('.')[0]
  }

  return valueWithoutExtension
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await cloudinary.uploader.destroy(publicId)
    if (response.result !== 'ok') {
      throw createHTTPError(400, 'image was not deleted from cloudinary')
    }
    console.log('image was deleted from cloudinary')
  } catch (error) {
    throw error
  }
}
