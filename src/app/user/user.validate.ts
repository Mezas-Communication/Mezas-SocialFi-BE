import { Constant } from '@constants'
import { ethers } from 'ethers'
import { fromBuffer } from 'file-type'
import isSvg from 'is-svg'
import { type FieldErrors } from 'tsoa'

const { MAX_IMAGE_SIZE } = Constant

/**
 * Validates an Ethereum address using ethers.js library.
 * @param {string} address - The Ethereum address to validate.
 * @returns {boolean} - True if the address is valid, false otherwise.
 */
export const inputGetUserValidate = (address: string): FieldErrors | null => {
  try {
    /**
     * Checks if the given Ethereum address is valid.
     */
    if (address.length !== 42 || !address.startsWith('0x')) {
      return {
        address: {
          message: 'Length must be 42 and start with 0x',
          value: address
        }
      }
    }

    /**
     * Checks if the given string is a valid Ethereum address.
     */
    if (!ethers.utils.isAddress(address)) {
      return {
        address: {
          message: 'Invalid Ethereum address',
          value: address
        }
      }
    }

    return null
  } catch (error: any) {
    return {
      address: {
        message: error.message,
        value: address
      }
    }
  }
}

export const validateUpdateUserName = (newName: string): FieldErrors | null => {
  if (newName.length < 3 || newName.length > 256) {
    return {
      name: {
        message: 'Name must be between 3 and 256 characters',
        value: newName
      }
    }
  }
  return null
}

/**
 * Validate upload image
 * @param {Express.Multer.File} image - The image file to upload.
 * @returns {boolean} - True if the image is valid, false otherwise.
 */
export const uploadAvatarValidate = async (
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
    if (image.length > MAX_IMAGE_SIZE) {
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
