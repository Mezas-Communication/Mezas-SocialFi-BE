import { readFile, uploadFile } from '@providers'
import type { OutputGetImages, OutputUpload } from '@app'
import { image } from '@schemas'
class MetadataService {
  /**
   * Uploads an image to a remote server.
   * @param {Buffer} imageBuffer - The image buffer to upload.
   * @returns {Promise<OutputUpload>} A promise that resolves to an object containing information about the uploaded image.
   */
  public async uploadImage(imageBuffer: Buffer): Promise<OutputUpload> {
    const url = await uploadFile(imageBuffer)
    await image.findOrCreate({
      where: {
        url
      },
      defaults: {
        url
      }
    })
    return url
  }

  /**
   * Reads a file from the given CID and returns a Promise that resolves to a Buffer.
   * @param {string} cid - The CID of the file to read.
   */
  public async readFile(cid: string): Promise<any> {
    return readFile(cid)
  }

  /**
   * Gets a list of images from the database.
   * @param {number} page - The page number to get.
   * @param {number} litmit - The number of items to get per page.
   */
  public async getImages(
    page: number = 1,
    litmit: number = 20
  ): Promise<OutputGetImages> {
    const { count, rows } = await image.findAndCountAll({
      distinct: true,
      where: {},
      offset: (page - 1) * litmit,
      limit: litmit
    })
    return {
      data: rows,
      total: count
    }
  }
}

export { MetadataService }
