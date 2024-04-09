import { ethers } from 'ethers'
export interface PayloadJwt {
  username?: string
  role?: number
  address?: string
}

export enum NFTStatus {
  COMPLETED = 0,
  MINTING = 1,
  TRANSFERRING = 2,
  UPDATING = 3
}

/**
 * A constant representing the Ethereum zero address.
 * @constant {string}
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
/**
 * The amount of time in milliseconds that an OTP code is valid for.
 */
const OTP_TIMEOUT = 60000
/**
 * A constant representing a 32-byte value of all zeros.
 * @constant {string}
 */
const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
/**
 * An object containing constants for user roles.
 * @property {number} ADMIN - The value representing an admin user.
 * @property {number} USER - The value representing a regular user.
 */
const USER_ROLE = {
  ADMIN: 1,
  USER: 0
}
/**
 * Generates a verification code for a user based on their username, hashed password, and a timestamp.
 * @param {string} username - The username of the user.
 * @param {string} hashed_password - The hashed password of the user.
 * @param {Date} timestamp - The timestamp to use for generating the verification code.
 * @returns {string} The verification code as a hashed value.
 */
const getVerifyCode = (
  username: string,
  hashed_password: string,
  timestamp: Date
) => {
  const secret_key = `${username}-${hashed_password}`
  const hashed_value = ethers.utils.hashMessage(
    `${timestamp.getTime()}${secret_key}`
  )
  return hashed_value
}

const getSlug = (token_id: string) => {
  return `${ethers.utils.hashMessage(token_id).slice(2, 16)}`.toLowerCase()
}

const DEFAULT_JSON_NFT = {
  type: 'hero',
  is_active_owner: true,
  properties: {
    rarity: {
      type: 'number',
      value: null,
      is_active: true
    },
    class: {
      type: 'number',
      value: null,
      is_active: true
    },
    level: {
      type: 'number',
      value: null,
      is_active: true
    },
    move_speed: {
      type: 'number',
      value: null,
      is_active: true
    },
    attack_points: {
      type: 'number',
      value: null,
      is_active: true
    },
    health_points: {
      type: 'number',
      value: null,
      is_active: true
    },
    defender_points: {
      type: 'number',
      value: null,
      is_active: true
    },
    win_count: {
      type: 'number',
      value: null,
      is_active: true
    }
  }
}

/**
 * An object containing various constants used throughout the application.
 */
const Constant = {
  JWT_EXPIRES_IN: '1d',
  JWT_REFRESH_EXPIRES_IN: '2d',
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  JWT_SECRET_REFRESH: `${process.env.JWT_SECRET_REFRESH}`,
  SECRET: `${process.env.SECRET}`,
  GOOGLE_CLIENT_ID: `${process.env.GOOGLE_CLIENT_ID}`,
  GOOGLE_CLIENT_SECRET: `${process.env.GOOGLE_CLIENT_SECRET}`,
  S3_SECRET_ACCESS_KEY: `${process.env.S3_SECRET_ACCESS_KEY}`,
  S3_ACCESS_KEY: `${process.env.S3_ACCESS_KEY}`,
  S3_BUCKET_NAME: `${process.env.S3_BUCKET_NAME}`,
  ADMIN_INITIAL_USERNAME: `${process.env.ADMIN_INITIAL_USERNAME}`,
  ADMIN_INITIAL_PASSWORD: `${process.env.ADMIN_INITIAL_PASSWORD}`,
  PORT: `${process.env.PORT}`,
  BLOCKCHAIN_URL: `${process.env.BLOCKCHAIN_URL}`,
  DB_NAME: `${process.env.DB_NAME}`,
  DB_USER: `${process.env.DB_USER}`,
  DB_PASSWORD: `${process.env.DB_PASSWORD}`,
  DB_HOST: `${process.env.DB_HOST}`,
  DB_PORT: `${process.env.DB_PORT}`,
  DB_SCHEMA: `${process.env.DB_SCHEMA}`,
  NFT_CONTRACT_ADDRESS: `${process.env.NFT_CONTRACT_ADDRESS}`,
  ZERO_ADDRESS,
  ZERO_BYTES32,
  MESSAGE_LIMIT_SYNC: 10000,
  SOCKET_RESPONSE_TIMEOUT: 5000,
  MAX_FILE_UPLOAD: 10,
  LIMIT_MESSAGE: 25,
  EXPIRE_TIME: 24 * 60 * 60 * 1000,
  MAX_IMAGE_SIZE: 3 * 1024 * 1024,
  PATH_UPLOAD_FILE: '../upload_file/',
  NETWORK_STATUS_CODE: {
    EMPTY: 204,
    SUCCESS: 200,
    BAD_REQUEST: 400,
    EXPIRE: 498,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_ENOUGH_RIGHT: 403,
    CONTENT_TOO_LARGE: 413,
    VALIDATE_ERROR: 422,
    LOGIN_BEFORE: 400,
    OTP_EXPIRED: 400,
    INVALID_VERIFY_CODE: 400,
    ADMIN_NOT_FOUND: 404
  },
  NETWORK_STATUS_MESSAGE: {
    EMPTY: 'Empty',
    SUCCESS: 'Success',
    BAD_REQUEST: 'Bad request',
    EXPIRE: 'Expire time',
    UNAUTHORIZED: 'Unauthorized',
    NOT_FOUND: 'Not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    NOT_ENOUGH_RIGHT: 'Not Enough Rights',
    CONTENT_TOO_LARGE: 'Content too large',
    VALIDATE_ERROR: 'Validate error',
    LOGIN_BEFORE: 'Please login before',
    OTP_EXPIRED: 'OTP expired',
    INVALID_VERIFY_CODE: 'Invalid verify code',
    ADMIN_NOT_FOUND: 'Admin not found'
  },
  CONTRACT_EVENT: {
    TRANSFER: 'Transfer',
    UPDATE: 'URIUpdated',
    MINT: 'Mint'
  },
  RANDOM_COMPLEXITY: 10000000,
  USER_ROLE
}

export { Constant, getVerifyCode, OTP_TIMEOUT, DEFAULT_JSON_NFT, getSlug }
