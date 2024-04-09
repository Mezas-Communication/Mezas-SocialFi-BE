import type {
  InputLoginAdmin,
  InputRefreshToken,
  InputSubmitMnemonicAdmin,
  InputSubmitMnemonicUser,
  InputVerifyPassword,
  OutputLoginAdmin,
  OutputLogout,
  OutputRefreshToken,
  OutputSubmitAdmin,
  OutputSubmitUser,
  OutputVerifyPassword
} from '@app'
import { Constant, ErrorHandler, OTP_TIMEOUT, getVerifyCode } from '@constants'
import { hashText, renewJWT, signJWT } from '@providers'
import { token, user } from '@schemas'
import { ethers } from 'ethers'
import { OAuth2Client, type TokenPayload } from 'google-auth-library'

class AuthService {
  /**
   * An array of strings representing the keys of user data that should be excluded from
   * admin access.
   */
  excludeAdminUserData = ['password', 'delete_at']

  /**
   * Logs in an admin user with the given credentials and returns either a string or a user object.
   * @param {InputLoginAdmin} body - The login credentials for the admin user.
   * @returns {Promise<OutputLoginAdmin>} - A promise that resolves to a object.
   * If the user is not found, an error is thrown.
   */
  public async loginAdmin(body: InputLoginAdmin): Promise<OutputLoginAdmin> {
    /**
     * Check if admin exist in database, if not throw error invalid username
     */
    const isAdminExist = await user.findOne({
      where: {
        role: Constant.USER_ROLE.ADMIN,
        username: body.username
      }
    })
    if (!isAdminExist) {
      throw new ErrorHandler(
        {
          username: {
            message: 'Username is not exist',
            value: body.username
          }
        },
        Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED
      )
    }

    /**
     * Hashes the given password using a secure one-way hashing algorithm.
     */
    const hashed_password = hashText(body.password)
    /**
     * Finds a user in the database with the given username and password.
     * The object will have all attributes except for those specified in this.excludeAdminUserData.
     */
    const res = await user.findOne({
      where: {
        username: body.username,
        password: hashed_password
      },
      attributes: {
        exclude: this.excludeAdminUserData
      }
    })
    if (res) {
      /**
       * Updates the last login time for a user and saves the changes to the database.
       */
      res.last_login_at = new Date()
      await res.save()
      /**
       * If the response object does not contain a mnemonic, generate a verification code
       * using the provided username, hashed password, and last login time.
       */
      if (!res.mnemonic) {
        return {
          detail: null,
          otp_code: getVerifyCode(
            body.username,
            hashed_password,
            res.last_login_at
          ),
          access_token: null,
          refresh_token: null
        }
      }
      /**
       * Generates a JSON Web Token (JWT) with the given user information and secret key.
       */
      const jwtPayload = signJWT({
        username: res.username,
        role: res.role,
        address: res.address
      })
      await token.findOrCreate({
        where: {
          user_id: res.id,
          token: hashText(jwtPayload.access_token)
        }
      })
      return {
        detail: res.toJSON(),
        ...jwtPayload,
        otp_code: null
      }
    }
    throw new ErrorHandler(
      {
        password: {
          message: 'Password is incorrect',
          value: body.password
        }
      },
      Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    )
  }

  /**
   * Submits the mnemonic for an admin user and saves it to the database.
   * @param {InputSubmitMnemonicAdmin} signature_payload - The signature payload containing the encrypted mnemonic and signature.
   * @param {string} verify_code - The verification code to confirm the user's identity.
   * @returns {Promise<OutputSubmitAdmin>} - The updated user object without the password field.
   * If the admin user is not found, the OTP has expired, or the verification code is invalid.
   */
  public async submitMnemonicAdmin({
    signature_payload,
    verify_code
  }: InputSubmitMnemonicAdmin): Promise<OutputSubmitAdmin> {
    /**
     * Finds a user in the database with the role of ADMIN and returns their data
     * excluding the specified fields.
     */
    const res = await user.findOne({
      where: {
        role: Constant.USER_ROLE.ADMIN
      },
      attributes: {
        exclude: this.excludeAdminUserData.filter(e => e !== 'password')
      }
    })
    /**
     * Checks if the response object contains a username and password, and if the last login time is valid.
     * If the last login time is valid, it checks if the current verification code matches the expected code.
     */
    if (res && !!res.username && !!res.password) {
      /**
       * Checks if the last login time is available and if it is not, throws an error.
       * If the last login time is available, it is converted to a Date object and the difference
       * between the current time and the last login time is calculated. If the difference is greater
       * than the OTP timeout, an error is thrown.
       */
      let last_login_at = res.last_login_at
      if (!last_login_at) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.LOGIN_BEFORE)
      }
      last_login_at = new Date(last_login_at)
      const diff = Date.now() - last_login_at.getTime()
      if (diff > OTP_TIMEOUT) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.OTP_EXPIRED)
      }
      /**
       * Generates a verification code for the given user credentials and last login time.
       */
      const current_verify_code = getVerifyCode(
        res.username,
        res.password,
        last_login_at
      )
      if (current_verify_code !== verify_code) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.INVALID_VERIFY_CODE)
      }
      /**
       * If the result object does not have a mnemonic and the user role is admin, this function
       * verifies the signature payload and saves the mnemonic encrypted and address to the result object.
       */
      if (!res.mnemonic && res.role === Constant.USER_ROLE.ADMIN) {
        const [mnemonic_encrypted, signature] = signature_payload.split(':')
        const address = ethers.utils.verifyMessage(
          mnemonic_encrypted,
          signature
        )
        res.mnemonic = mnemonic_encrypted
        res.address = address.toLowerCase()
        await res.save()
      }

      /**
       * Generates a JSON Web Token (JWT) with the given user information and secret key.
       */
      const jwtPayload = signJWT({
        username: res.username,
        role: res.role,
        address: res.address
      })
      await token.findOrCreate({
        where: {
          user_id: res.id,
          token: hashText(jwtPayload.access_token)
        }
      })
      return {
        detail: (({ password, ...object }) => object)(res.toJSON()),
        ...jwtPayload,
        otp_code: null
      }
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND)
  }

  /**
   * Refreshes the access token of a user or admin.
   * @param {InputRefreshToken} body - The refresh token of user or admin.
   * @returns {OutputRefreshToken} - A object.
   */
  async refreshToken(body: InputRefreshToken): Promise<OutputRefreshToken> {
    try {
      const { access_token, payload } = renewJWT(body.refresh_token)
      const userRes = await user.findOne({
        where: {
          address: payload.address
        }
      })
      if (!userRes) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
      }
      await token.findOrCreate({
        where: {
          user_id: userRes.id,
          token: hashText(access_token)
        }
      })
      return {
        access_token
      }
    } catch (error) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }
  }

  /**
   * Verifies the password of a user or admin.
   * @param {InputVerifyPassword} body - The password of user or admin.
   * @param {string} address - The address of user or admin.
   * @returns {Promise<OutputVerifyPassword>} - A promise that resolves to a object.
   * If the password is not correct, an error is thrown.
   * If the user or admin is not found, an error is thrown.
   */
  async verifyPassword(
    body: InputVerifyPassword,
    address: string
  ): Promise<OutputVerifyPassword> {
    const userRes = await user.findOne({
      where: {
        address,
        password: hashText(body.password)
      }
    })
    return {
      authorized: !!userRes
    }
  }

  /**
   * Logs out a user or admin.
   * @param {string} access_token - The access token of user or admin.
   * @returns {Promise<OutputLogout>} - A promise that resolves to a object.
   */
  async logout(access_token: string): Promise<OutputLogout> {
    await token.destroy({
      where: {
        token: hashText(access_token)
      }
    })
    return {
      logout: true
    }
  }

  /**
   * Verifies google token id.
   * @param {string} google_token_id - The google token id of user or admin.
   * @param {string} platform - The platform of user or admin.
   * @returns {Promise<OutputSubmitUser>} - A promise that resolves to a object.
   */
  async verifyGoogle(google_token_id: string): Promise<OutputSubmitUser> {
    const clientId = Constant.GOOGLE_CLIENT_ID
    const client = new OAuth2Client(clientId)
    const ticket = await client.verifyIdToken({
      idToken: google_token_id,
      audience: clientId
    })
    const payload = ticket.getPayload() as TokenPayload
    const { sub } = payload
    if (!sub) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    /**
     * Finds a user in the database with the given username.
     * The object will have all attributes except for those specified in this.excludeAdminUserData.
     */
    const [res] = await user.findOrCreate({
      where: {
        username: sub
      }
    })
    /**
     * Updates the last login time for a user and saves the changes to the database.
     */
    res.last_login_at = new Date()
    await res.save()
    /**
     * If the response object does not contain a mnemonic, generate a verification code
     * using the provided username, hashed password, and last login time.
     */
    if (!res.mnemonic) {
      return {
        detail: null,
        otp_code: getVerifyCode(sub, '', res.last_login_at),
        access_token: null,
        refresh_token: null
      }
    }
    /**
     * Generates a JSON Web Token (JWT) with the given user information and secret key.
     */
    const jwtPayload = signJWT({
      username: res.username,
      role: res.role,
      address: res.address
    })
    await token.findOrCreate({
      where: {
        user_id: res.id,
        token: hashText(jwtPayload.access_token)
      }
    })
    return {
      detail: res.toJSON(),
      ...jwtPayload,
      otp_code: null
    }
  }

  /**
   * Submits the mnemonic for a user and saves it to the database.
   * @param {string} id_token - The id token of user.
   * @param {string} social_type - The social type of user.
   * @param {string} platform - The platform of user.
   * @param {string} signature_payload - The signature payload containing the encrypted mnemonic and signature.
   * @param {string} verify_code - The verification code to confirm the user's identity.
   * @returns {Promise<OutputSubmitUser>} - The updated user object without the password field.
   */
  async submitMnemonicUser({
    token_id,
    signature_payload,
    verify_code,
    password
  }: InputSubmitMnemonicUser): Promise<OutputSubmitUser> {
    const clientId = Constant.GOOGLE_CLIENT_ID
    const client = new OAuth2Client(clientId)
    const ticket = await client.verifyIdToken({
      idToken: token_id,
      audience: clientId
    })
    if (!ticket.getPayload()) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    const sub = ticket.getPayload()?.sub
    const res = await user.findOne({
      where: {
        username: sub
      }
    })
    /**
     * Checks if the response object contains a username and password, and if the last login time is valid.
     * If the last login time is valid, it checks if the current verification code matches the expected code.
     */
    if (res && !!res.username) {
      /**
       * Checks if the last login time is available and if it is not, throws an error.
       * If the last login time is available, it is converted to a Date object and the difference
       * between the current time and the last login time is calculated. If the difference is greater
       * than the OTP timeout, an error is thrown.
       */
      let last_login_at = res.last_login_at
      if (!last_login_at) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.LOGIN_BEFORE)
      }
      last_login_at = new Date(last_login_at)
      const diff = Date.now() - last_login_at.getTime()
      if (diff > OTP_TIMEOUT) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.OTP_EXPIRED)
      }
      /**
       * Generates a verification code for the given user credentials and last login time.
       */
      const current_verify_code = getVerifyCode(res.username, '', last_login_at)
      if (current_verify_code !== verify_code) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.INVALID_VERIFY_CODE)
      }
      /**
       * If the result object does not have a mnemonic and the user role is admin, this function
       * verifies the signature payload and saves the mnemonic encrypted and address to the result object.
       */
      if (!res.mnemonic && res.role === Constant.USER_ROLE.USER) {
        const [mnemonic_encrypted, signature] = signature_payload.split(':')
        const address = ethers.utils.verifyMessage(
          mnemonic_encrypted,
          signature
        )
        res.mnemonic = mnemonic_encrypted
        res.address = address.toLowerCase()
        res.password = hashText(password)
        await res.save()
      }

      /**
       * Generates a JSON Web Token (JWT) with the given user information and secret key.
       */
      const jwtPayload = signJWT({
        username: res.username,
        role: res.role,
        address: res.address
      })
      await token.findOrCreate({
        where: {
          user_id: res.id,
          token: hashText(jwtPayload.access_token)
        }
      })
      /**
       * This function takes in a response object and returns a new object that is a copy of the response object
       * but with the 'password' property removed.
       */
      return {
        detail: (({ password, ...object }) => object)(res.toJSON()),
        ...jwtPayload,
        otp_code: null
      }
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }
}

export { AuthService }
