import { ethers } from 'ethers'
import { type FieldErrors } from 'tsoa'

/**
 * Validates an Ethereum address using ethers.js library.
 * @param {string} address - The Ethereum address to validate.
 * @returns {boolean} - True if the address is valid, false otherwise.
 */
export const inputGetUserValidate = (address: string): FieldErrors | null => {
  try {
    /**
     * Checks if the given Ethereum address is valid.
     */
    if (address.length !== 42 || !address.startsWith('0x')) {
      return {
        address: {
          message: 'Length must be 42 and start with 0x',
          value: address
        }
      }
    }

    /**
     * Checks if the given string is a valid Ethereum address.
     */
    if (!ethers.utils.isAddress(address)) {
      return {
        address: {
          message: 'Invalid Ethereum address',
          value: address
        }
      }
    }

    return null
  } catch (error: any) {
    return {
      address: {
        message: error.message,
        value: address
      }
    }
  }
}
