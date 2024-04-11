import { Constant } from '@constants'
import { uploadFile } from '@providers'
import { type OutputUpload } from '@app'
import { type IUser, user } from '@schemas'
class UserService {
  /**
   * Retrieves a user from the database based on their Ethereum address.
   * @param {string} address - The Ethereum address of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to the user object if found, or null if not found.
   */
  public async getUser(address: string): Promise<IUser> {
    /**
     * Finds a user in the database based on their address and returns their information.
     */
    const res = await user.findOne({
      where: {
        address
      },
      attributes: ['id', 'username', 'address', 'name', 'role', 'avatar']
    })
    if (res) return res.toJSON()
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Retrieves a user from the database based on their Ethereum address.
   * @param {string} address - The Ethereum address of the user to retrieve.
   * @returns {Promise<IUser>} A promise that resolves to the user object if found, or null if not found.
   */
  public async updateUserName(
    address: string,
    newName?: string,
    newAvatar?: string
  ): Promise<IUser> {
    /**
     * Finds a user in the database based on their address and updates their name.
     */
    if (!address) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    const res = await user.findOne({
      where: {
        address
      },
      attributes: ['id', 'username', 'address', 'name', 'avatar']
    })

    if (!res) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    if (newName) {
      res.name = newName
    }

    if (newAvatar) {
      res.avatar = newAvatar
    }
    await res.save()
    return res
  }

  public async getProfileUser(address: string): Promise<IUser> {
    /**
     * Finds a user in the database based on their address and returns their information.
     */
    const res = await user.findOne({
      where: {
        address
      },
      attributes: ['username', 'address', 'name', 'avatar']
    })
    if (res) return res.toJSON()
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Uploads an image to a remote server.
   * @param {Buffer} imageBuffer - The image buffer to upload.
   * @returns {Promise<OutputUpload>} A promise that resolves to an object containing information about the uploaded image.
   */
  public async uploadAvatar(imageBuffer: Buffer): Promise<OutputUpload> {
    const cid = await uploadFile(imageBuffer)
    return cid
  }
}

export { UserService }
