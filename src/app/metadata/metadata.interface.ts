import { type IImage } from '@schemas'

/**
 * @typedef {any} OutputRead - The type definition for the output of a read operation.
 */
export type OutputRead = any

/**
 * Interface for the JSON object that is uploaded as input.
 * @interface InputUploadJson
 * @property {string} title - The title of the input.
 * @property {string} image - The image associated with the input.
 * @property {string} type - The type of input.
 * @property {boolean} is_active_owner - The is_active_owner of the input.
 * @property {Object} properties - An object containing the properties of the input.
 * @property {Object} properties.class - An object containing the class property.
 * @property {string} properties.class.type - The type of the class property.
 * @property {number} properties.class.value - The value of the number
 * @property {Object} properties.level - An object containing the level property.
 * @property {string} properties.level.type - The type of the level property.
 * @property {number} properties.level.value - The value of the level property.
 * @property {Object} properties.move_speed - An object containing the move_speed property.
 * @property {string} properties.move_speed.type - The type of the move_speed property.
 * @property {string} properties.move_speed.value - The value of the move_speed property.
 * @property {Object} properties.attack_points - An object containing the attack_points property.
 * @property {string} properties.attack_points.type - The type of the attack_points property.
 * @property {number} properties.attack_points.value - The value of the attack_points property.
 * @property {Object} properties.health_points - An object containing the health_points property.
 * @property {string} properties.health_points.type - The type of the health_points property.
 * @property {number} properties.health_points.value - The value of the health_points property.
 * @property {Object} properties.defender_points - An object containing the defender_points property.
 * @property {string} properties.defender_points.type - The type of the defender_points property.
 * @property {number} properties.defender_points.value - The value of the defender_points property.
 * @property {Object} properties.win_count - An object containing the win_count property.
 * @property {string} properties.win_count.type - The type of the win_count property.
 * @property {number} properties.win_count.value - The value of the win_count property.
 */
export interface InputUploadJson {
  title: string
  image: string
  is_active_owner: boolean
  type?: string
  properties: {
    class: {
      type: string
      value: string | null
      is_active: boolean
    }
    level: {
      type: string
      value: number | null
      is_active: boolean
    }
    move_speed: {
      type: string
      value: number | null
      is_active: boolean
    }
    attack_points: {
      type: string
      value: number | null
      is_active: boolean
    }
    health_points: {
      type: string
      value: number | null
      is_active: boolean
    }
    defender_points: {
      type: string
      value: number | null
      is_active: boolean
    }
    win_count: {
      type: string
      value: number | null
      is_active: boolean
    }
  }
}

/**
 * Interface for the JSON object that is uploaded as input.
 * @interface OutputUploadJson
 * @property {string} title - The title of the input.
 * @property {string} image - The image associated with the input.
 * @property {string} type - The type of input.
 * @property {Object} properties - An object containing the properties of the input.
 * @property {Object} properties.class - An object containing the class property.
 * @property {string} properties.class.type - The type of the class property.
 * @property {number} properties.class.value - The value of the number
 * @property {Object} properties.level - An object containing the level property.
 * @property {string} properties.level.type - The type of the level property.
 * @property {number} properties.level.value - The value of the level property.
 * @property {move_speedFormat} properties.move_speed - An object containing the move_speed property.
 * @property {Object} properties.attack_points - An object containing the attack_points property.
 * @property {string} properties.attack_points.type - The type of the attack_points property.
 * @property {number} properties.attack_points.value - The value of the attack_points property.
 * @property {Object} properties.health_points - An object containing the health_points property.
 * @property {string} properties.health_points.type - The type of the health_points property.
 * @property {number} properties.health_points.value - The value of the health_points property.
 * @property {Object} properties.defender_points - An object containing the defender_points property.
 * @property {string} properties.defender_points.type - The type of the defender_points property.
 * @property {number} properties.defender_points.value - The value of the defender_points property.
 * @property {Object} properties.win_count - An object containing the win_count property.
 * @property {string} properties.win_count.type - The type of the win_count property.
 * @property {number} properties.win_count.value - The value of the win_count property.
 */
export interface OutputUploadJson {
  title: string
  image: string
  type?: string
  properties?: {
    class?: {
      type: string
      value: number
    }
    level?: {
      type: string
      value: number
    }
    move_speed?: {
      type: string
      value: number
    }
    attack_points?: {
      type: string
      value: number
    }
    health_points?: {
      type: string
      value: number
    }
    defender_points?: {
      type: string
      value: number
    }
    win_count?: {
      type: string
      value: number
    }
  }
}

/**
 * Interface for the JSON object that is uploaded as input.
 * @interface OutputGetImages
 * @property {IImage[]} data - The data of the IImage.
 * @property {number} total - The total of the images.
 */
export interface OutputGetImages {
  data: IImage[]
  total: number
}
