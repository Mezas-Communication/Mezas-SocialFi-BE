import type { InputLoginAdmin } from '@app'
import { type FieldErrors } from 'tsoa'

/**
 * Validates the input for an admin login.
 * @param {InputLoginAdmin} body - The input object containing the username and password.
 * @returns {boolean} - True if the input is valid, false otherwise.
 */
export const inputLoginAdminValidate = (
  body: InputLoginAdmin
): FieldErrors | null => {
  try {
    /**
     * Checks if the length of the username in the request body is between 8 and 256 characters.
     */
    const regexLength = /^.{8,320}$/

    if (!regexLength.test(body.username)) {
      return {
        username: {
          message: 'Username must be between 8 and 320 characters.',
          value: body.username
        }
      }
    }

    if (!regexLength.test(body.password)) {
      return {
        password: {
          message: 'Password must be between 8 and 320 characters.',
          value: body.password
        }
      }
    }

    // Check if start with special character
    const regexNotStartWithSpecialCharacter = /^[^a-zA-Z0-9]/
    if (regexNotStartWithSpecialCharacter.test(body.username[0])) {
      return {
        username: {
          message: 'Username must not start with special character.',
          value: body.username
        }
      }
    }

    /**
     * Checks if the given username is a valid email address.
     */
    if (body.username.includes('@')) {
      const regex =
        /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      if (!regex.test(body.username)) {
        return {
          username: {
            message: 'Username must be a valid email address.',
            value: body.username
          }
        }
      }
      const afterEmail = body.username.split('@')[1]
      const regexAfterEmail = /(\W)\1/
      if (regexAfterEmail.test(afterEmail)) {
        return {
          username: {
            message:
              'Username must not contain consecutive special characters.',
            value: body.username
          }
        }
      }
    }

    /**
     * Regular expressions for matching lowercase letters, uppercase letters, numbers, and special characters.
     * @constant {RegExp} regexLowercase - matches lowercase letters
     * @constant {RegExp} regexUppercase - matches uppercase letters
     * @constant {RegExp} regexNumber - matches numbers
     * @constant {RegExp} regexSpecialCharacter - matches special characters
     */
    const regexLowercase = /[a-z]/
    const regexUppercase = /[A-Z]/
    const regexNumber = /[0-9]/
    const regexSpecialCharacter = /[^a-zA-Z0-9]/
    /**
     * An array of regular expressions used to validate a password. The password must meet the following criteria:
     * - Contains at least one lowercase letter
     * - Contains at least one uppercase letter
     * - Contains at least one number
     * - Contains at least one special character
     */
    const listValidate = [
      regexLowercase.test(body.password),
      regexUppercase.test(body.password),
      regexNumber.test(body.password),
      regexSpecialCharacter.test(body.password)
    ]
    /**
     * Checks if the number of valid items in a list is less than 3, which means that the password does not meet the criteria.
     */
    if (listValidate.filter(item => !!item).length < 3) {
      return {
        password: {
          message:
            'Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, and special characters.',
          value: body.password
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
