import type { InputUploadJson } from '@app'
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

const validateNumberWithDecimal = (value: number | string): string | null => {
  if (`${value}`.includes('-')) {
    return 'Number must be greater or equal 0'
  }

  if (!`${value}`.includes('.') && `${value}`.length > 18) {
    return 'Number must be less than 18 digits'
  }

  if (`${value}`.includes('.')) {
    const [integer, decimal] = `${value}`.split('.')
    if (integer.length > 15) {
      return 'Number must be less than 15 before decimal point'
    }
    if (decimal.length > 2) {
      return 'Number must be less than 2 after decimal point'
    }
  }

  return null
}

/**
 * Validate upload json
 * @param {InputUploadJson} body - The json file to upload.
 * @returns {boolean} - True if the json is valid, false otherwise.
 */
export const inputUploadJsonValidate = (
  body: InputUploadJson
): FieldErrors | null => {
  try {
    const { title, type, properties } = body
    const {
      win_count,
      health_points,
      defender_points,
      attack_points,
      move_speed,
      level
    } = properties
    const classes = body.properties.class
    /**
     * @param {string} title - The title of the input.
     * @validate BR-COM-023
     */
    if (title.length < 1 || title.length > 256) {
      return {
        title: {
          message: 'Title must be between 1 and 256 characters',
          value: title
        }
      }
    }

    /**
     * @param {string} type - The type of input.
     * @validate BR-COM-023
     */
    if (type) {
      if (type.length > 256) {
        return {
          type: {
            message: 'Type must be less than 256 characters',
            value: type
          }
        }
      }
    }

    /**
     * @param {number} class - The class.
     * @validate BR-COM-005 - Format number
     */

    if (classes.value) {
      const class_validate = validateNumberWithDecimal(classes.value)
      if (class_validate) {
        return {
          'properties.class': {
            message: class_validate,
            value: classes.value
          }
        }
      }
    }

    /**
     * @param {EpochTimeStamp} level - The level.
     * @validate BR-COM-005 - Format number
     */
    if (level.value) {
      const level_validate = validateNumberWithDecimal(level.value)
      if (level_validate) {
        return {
          'properties.level': {
            message: level_validate,
            value: level.value
          }
        }
      }
    }

    /**
     * @param {number} move_speed - The move speed.
     * @validate BR-COM-024 - Format move_speed
     */
    if (move_speed.value) {
      const move_speed_validate = validateNumberWithDecimal(move_speed.value)
      if (move_speed_validate) {
        return {
          'properties.move_speed': {
            message: move_speed_validate,
            value: move_speed.value
          }
        }
      }
    }

    /**
     * @param {number} attack_points - The attack points.
     * @validate BR-COM-005 - Format number
     */
    if (attack_points.value) {
      const attack_points_validate = validateNumberWithDecimal(
        attack_points.value
      )
      if (attack_points_validate) {
        return {
          'properties.attack_points': {
            message: attack_points_validate,
            value: attack_points.value
          }
        }
      }
    }

    /**
     * @param {number} health_points - The health points.
     * @validate BR-COM-005 - Format number
     */
    if (health_points.value) {
      const health_points_validate = validateNumberWithDecimal(
        health_points.value
      )
      if (health_points_validate) {
        return {
          'properties.health_points': {
            message: health_points_validate,
            value: health_points.value
          }
        }
      }
    }

    /**
     * @param {number} defender_points - The defender points.
     * @validate BR-COM-005 - Format number
     */
    if (defender_points.value) {
      const defender_points_validate = validateNumberWithDecimal(
        defender_points.value
      )
      if (defender_points_validate) {
        return {
          'properties.defender_points': {
            message: defender_points_validate,
            value: defender_points.value
          }
        }
      }
    }

    /**
     * @param {number} win_count - The win count.
     * @validate BR-COM-005 - Format number
     */
    if (win_count.value) {
      const win_count_validate = validateNumberWithDecimal(win_count.value)
      if (win_count_validate) {
        return {
          'properties.win_count': {
            message: win_count_validate,
            value: win_count.value
          }
        }
      }
    }

    return null
  } catch (error: any) {
    return {
      error: {
        message: error.message,
        value: body
      }
    }
  }
}
