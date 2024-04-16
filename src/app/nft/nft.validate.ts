import type { RangeFields, SortFields, SortTypes } from '@app'
import { ethers } from 'ethers'
import { type FieldErrors } from 'tsoa'

/**
 * Validates the input parameters for the inputOwnNft function.
 * @param {number} [page=1] - The page number to retrieve.
 * @param {number} [limit=10] - The number of items to retrieve per page.
 * @param {string} [search=''] - The search string to filter the results.
 * @param {SortFields} [sortFields=[]] - The fields to sort the results by.
 * @param {SortTypes} [sortType=[]] - The types of sort to apply to the fields.
 * @param {RangeFields} [rangeFields=[]] - The fields to apply range filters to.
 * @param {string[]} [fromValues=[]] - The values to filter the range fields from.
 * @param {string[]} [toValues=[]] - The values to filter the range fields to.
 * @param {string} [coordinate=''] - The coordinate to filter the results by.
 * @returns {boolean} - Returns true if the input parameters are valid, false otherwise.
 */
export const inputOwnNftValidate = (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  sortFields: SortFields = [],
  sortType: SortTypes = [],
  rangeFields: RangeFields = [],
  fromValues: string[] = [],
  toValues: string[] = [],
  address: string = ''
): FieldErrors | null => {
  if (page < 1) {
    return {
      page: {
        message: 'Page must be greater than 0',
        value: page
      }
    }
  }
  if (limit < 1) {
    return {
      limit: {
        message: 'Limit must be greater than 0',
        value: limit
      }
    }
  }
  if (search.length > 256) {
    return {
      search: {
        message: 'Search string must be less than 256 characters',
        value: search
      }
    }
  }
  /**
   * Checks if the length of the sortFields and sortType arrays arr greater than 9.
   * Makes sure that the length of the sortFields and sortType arrays are equal.
   */
  if (sortFields.length > 9) {
    return {
      sortFields: {
        message: 'Sort fields must be less than 9',
        value: sortFields
      }
    }
  }
  if (sortType.length > 9) {
    return {
      sortType: {
        message: 'Sort types must be less than 9',
        value: sortType
      }
    }
  }
  if (sortFields.length !== sortType.length) {
    return {
      sortFields: {
        message: 'Sort fields and sort types must be equal',
        value: sortFields
      },
      sortType: {
        message: 'Sort fields and sort types must be equal',
        value: sortType
      }
    }
  }
  /**
   * Checks if the length of the rangeFields, fromValues, and toValues arrays are greater than 6.
   * Max length of 6 is allowed.
   * Makes sure that the length of the rangeFields, fromValues, and toValues arrays are equal.
   */
  if (rangeFields.length > 6) {
    return {
      rangeFields: {
        message: 'Range fields must be less than 6',
        value: rangeFields
      }
    }
  }
  if (fromValues.length > 6) {
    return {
      fromValues: {
        message: 'From values must be less than 6',
        value: fromValues
      }
    }
  }
  if (toValues.length > 6) {
    return {
      toValues: {
        message: 'To values must be less than 6',
        value: toValues
      }
    }
  }
  if (rangeFields.length !== fromValues.length) {
    return {
      rangeFields: {
        message: 'Range fields and from values must be equal',
        value: rangeFields
      },
      fromValues: {
        message: 'Range fields and from values must be equal',
        value: fromValues
      }
    }
  }
  if (rangeFields.length !== toValues.length) {
    return {
      rangeFields: {
        message: 'Range fields and to values must be equal',
        value: rangeFields
      },
      toValues: {
        message: 'Range fields and to values must be equal',
        value: toValues
      }
    }
  }

  if (address.length > 0 && !ethers.utils.isAddress(address)) {
    return {
      address: {
        message: 'Address is not a valid address',
        value: address
      }
    }
  }
  return null
}
