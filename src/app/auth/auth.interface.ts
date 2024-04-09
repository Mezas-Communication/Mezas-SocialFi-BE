import type { IUser } from '@schemas'

/**
 * Interface for the input fields of the admin login form.
 * @interface InputLoginAdmin
 * @property {string} username - The username entered in the login form.
 * @property {string} password - The password entered in the login form.
 */
export interface InputLoginAdmin {
  username: string
  password: string
}

/**
 * Interface for the input object when refreshing an access token.
 * @interface InputRefreshToken
 * @property {string} refresh_token - The refresh token used to obtain a new access token.
 */
export interface InputRefreshToken {
  refresh_token: string
}

/**
 * Interface for the input object when verify password.
 * @interface InputVerifyPassword
 * @property {string} password - The password of user or admin.
 */
export interface InputVerifyPassword {
  password: string
}

/**
 * Interface for the mnemonic input submission object.
 * @interface
 * @property {string} signature_payload - The signature payload string.
 * @property {string} verify_code - The verification code string.
 */
export interface InputSubmitMnemonicAdmin {
  signature_payload: string
  verify_code: string
}

/**
 * Interface for the mnemonic input submission object.
 * @interface
 * @property {string} signature_payload - The signature payload string.
 * @property {string} verify_code - The verification code string.
 * @property {string} token_id - The token id string.
 * @property {string} social_type - The social type string.
 * @property {string} password - The password string.
 */
export interface InputSubmitMnemonicUser {
  signature_payload: string
  verify_code: string
  token_id: string
  social_type: string
  password: string
}

/**
 * Interface for the output of the login admin function.
 * @interface OutputLoginAdmin
 * @property {IUser | null} [detail] - The user details.
 * @property {string | null} [access_token] - The access token for the user.
 * @property {string | null} [refresh_token] - The refresh token for the user.
 * @property {string | null} [otp_code] - The OTP code for the user.
 */
export interface OutputLoginAdmin {
  detail: IUser | null
  access_token: string | null
  refresh_token: string | null
  otp_code: string | null
}

/**
 * Defines the type for the output of the submit admin function, which is the same as the output of the login admin function.
 * @typedef {OutputLoginAdmin} OutputSubmitAdmin
 */
export type OutputSubmitAdmin = OutputLoginAdmin
export type OutputLoginUser = OutputLoginAdmin
export type OutputSubmitUser = OutputLoginAdmin

/**
 * Interface for the output of a refresh token request.
 * @interface OutputRefreshToken
 * @property {string} access_token - The new access token.
 */
export interface OutputRefreshToken {
  access_token: string
}

/**
 * Interface for the output of verify password.
 * @interface OutputVerifyPassword
 * @property {boolean} authorized - Is account authorized.
 */
export interface OutputVerifyPassword {
  authorized: boolean
}

/**
 * Interface for the output of verify password.
 * @interface VerifyGoogleInput
 * @property {string} google_token_id - Is account authorized.
 */
export interface VerifyGoogleInput {
  google_token_id: string
}

/**
 * Interface for the output of logout.
 * @interface OutputLogout
 * @property {boolean} logout - Is account logouted.
 */
export interface OutputLogout {
  logout: boolean
}
