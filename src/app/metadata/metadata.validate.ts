import { fromBuffer } from 'file-type'
import { type FieldErrors } from 'tsoa'
import isSvg from 'is-svg'

/**
 * Validate upload image
 * @param {Express.Multer.File} image - The image file to upload.
 * @returns {boolean} - True if the image is valid, false otherwise.
 */
export const uploadImageValidate = async (
  image: Buffer
): Promise<FieldErrors | null> => {
  try {
    /**
     * @param {Buffer} image - The image file to upload.
     * @validate BR-COM-022
     * - Image maximum 3MB
     * - Only support: APNG, AVIF, GIF, JPEG, PNG, SVG, WebP
     */
    // Check if file is larger than 3MB
    if (image.length > 3 * 1024 * 1024) {
      return {
        image: {
          message: 'Image must be less than 3MB'
        }
      }
    }

    // Check if file is APNG, AVIF, GIF, JPEG, PNG, SVG, WebP
    const regexImageType = /image\/(apng|avif|gif|jpeg|png|svg\+xml|webp)/
    const imageType = await fromBuffer(image)
    if (
      !regexImageType.test(imageType?.mime ?? '') &&
      !isSvg(image.toString())
    ) {
      return {
        image: {
          message: 'Image must be APNG, AVIF, GIF, JPEG, PNG, SVG, WebP',
          value: imageType?.mime
        }
      }
    }

    return null
  } catch (error: any) {
    return {
      error: {
        message: error.message
      }
    }
  }
}
