import { Constant } from '@constants'
import { type IUser, user } from '@schemas'
class AdminService {
  /**
   * Retrieves the user information for the given address if the user is an admin.
   * @returns {Promise<IUser>} - A Promise that resolves to the user information object if the user is an admin.
   * @throws {Error} - If the user is not an admin, an error is thrown with the message "Admin not found".
   */
  public async infoAdmin(): Promise<IUser> {
    /**
     * Finds a single document in the "user" collection of the database.
     */
    const res = await user.findOne({
      where: {
        /**
         * Find the user role to ADMIN and the address was lowercase.
         */
        role: Constant.USER_ROLE.ADMIN
      },
      /**
       * An object containing attributes to exclude from a larger object.
       */
      attributes: {
        exclude: ['password', 'delete_at']
      }
    })
    if (res) return res.toJSON()
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND)
  }
}

export { AdminService }
