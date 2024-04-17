import { type IImage } from '@schemas'

/**
 * @typedef {any} OutputRead - The type definition for the output of a read operation.
 */
export type OutputRead = any

/**
 * Interface for the image that is uploaded as input.
 * @interface OutputGetImages
 * @property {IImage[]} data - The data of the IImage.
 * @property {number} total - The total of the images.
 */
export interface OutputGetImages {
  data: IImage[]
  total: number
}
