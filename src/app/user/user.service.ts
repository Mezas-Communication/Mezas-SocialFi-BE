import { Constant } from '@constants'
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
}

export { UserService }
