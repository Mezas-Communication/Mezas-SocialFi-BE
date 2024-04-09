import {
  InputLoginAdmin,
  inputLoginAdminValidate,
  InputRefreshToken,
  InputSubmitMnemonicAdmin,
  InputVerifyPassword,
  type OutputLogout,
  type OutputLoginAdmin,
  type OutputRefreshToken,
  type OutputSubmitAdmin,
  type OutputVerifyPassword,
  VerifyGoogleInput,
  type OutputLoginUser,
  InputSubmitMnemonicUser,
  type OutputSubmitUser
} from '@app'
import {
  Constant,
  ErrorHandler,
  logError,
  onError,
  onSuccess,
  type Option
} from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Body,
  Controller,
  Example,
  Middlewares,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags
} from 'tsoa'
const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Auth')
@Route('auth')
export class AuthController extends Controller {
  /**
   * Logs in an admin user and returns either an authentication token or the admin user's information.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputLoginAdmin} body - The login credentials for the admin user.
   * @returns {Promise<Option<string | IUser>>} - A promise that resolves to either an authentication token or the admin user's information.
   * @throws {UnauthorizedError} - If the user is not authorized to access the admin information.
   * @throws {NotFoundError} - If the admin user is not found.
   * @throws {ValidationError} - If there is a validation error with the request.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('admin/login')
  @Example<Option<OutputLoginAdmin>>(
    {
      data: {
        detail: null,
        otp_code:
          '0x7d3bd16aed6e675cb8e5166bac938cca31c1f64c1abf211cc4a6cd2988c24203',
        access_token: null,
        refresh_token: null
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'OTP code'
  )
  @Example<Option<OutputLoginAdmin>>(
    {
      data: {
        detail: {
          id: 1,
          name: 'admin',
          update_at: new Date(),
          create_at: new Date(),
          mnemonic:
            'U2FsdGVkX1/ABF7iuZOS4f7+76B1sdF1qRrhIMm8VOy6igU2eKRECdnJN9dTt7cCUuciUjy5L+bIFcIRKUS+lRnb3fFq110Acy0pRN+179Us0e0+0ItCoegPE/V8yqMC',
          role: 1,
          username: 'administrator',
          address: '0x3c90d8be4573f0582a2613e5cefe8727431db2f2',
          last_login_at: new Date(),
          view: '0'
        },
        otp_code: null,
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Admin info'
  )
  @Response<Option<OutputLoginAdmin>>(
    '422',
    NETWORK_STATUS_MESSAGE.VALIDATE_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
    }
  )
  @Response<Option<OutputLoginAdmin>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputLoginAdmin>>(
    '404',
    NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND
    }
  )
  @Response<Option<OutputLoginAdmin>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async loginAdmin(
    @Request() req: ExpressRequest,
    @Body() body: InputLoginAdmin
  ): Promise<Option<OutputLoginAdmin>> {
    try {
      /**
       * Validates the input login admin body and throws an error if it is invalid.
       */
      const validate = inputLoginAdminValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      /**
       * Logs in the admin user using the provided credentials.
       */
      const res = await Singleton.getAuthInstance().loginAdmin(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Endpoint for submitting mnemonic for admin authentication.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputSubmitMnemonicAdmin} body - The request body containing the mnemonic.
   * @returns {Promise<Option<OutputSubmitAdmin>>} - A promise that resolves to an object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the admin information.
   * @throws {NotFoundError} - If the admin user is not found.
   * @throws {BadRequestError} - If the OTP code is invalid.
   * @throws {ValidationError} - If there is a validation error with the request.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('admin/mnemonic')
  @Example<Option<OutputSubmitAdmin>>(
    {
      data: {
        detail: {
          id: 1,
          name: 'admin',
          update_at: new Date(),
          create_at: new Date(),
          mnemonic:
            'U2FsdGVkX1/ABF7iuZOS4f7+76B1sdF1qRrhIMm8VOy6igU2eKRECdnJN9dTt7cCUuciUjy5L+bIFcIRKUS+lRnb3fFq110Acy0pRN+179Us0e0+0ItCoegPE/V8yqMC',
          role: 1,
          username: 'administrator',
          address: '0x3c90d8be4573f0582a2613e5cefe8727431db2f2',
          last_login_at: new Date(),
          view: '0'
        },
        otp_code: null,
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Admin info'
  )
  @Response<Option<OutputSubmitAdmin>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputSubmitAdmin>>(
    '404',
    NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND
    }
  )
  @Response<Option<OutputSubmitAdmin>>(
    '400',
    NETWORK_STATUS_MESSAGE.INVALID_VERIFY_CODE,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INVALID_VERIFY_CODE
    }
  )
  @Response<Option<OutputSubmitAdmin>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async submitMnemonicAdmin(
    @Request() req: ExpressRequest,
    @Body() body: InputSubmitMnemonicAdmin
  ): Promise<Option<OutputSubmitAdmin>> {
    try {
      /**
       * Submits the given body to the authentication instance's submitMnemonicAdmin method.
       */
      const res = await Singleton.getAuthInstance().submitMnemonicAdmin(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Refreshes the admin user's authentication token.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputRefreshToken} body - The body containt refresh_token.
   * @returns {Promise<Option<string>>} - A promise that resolves to either an authentication token.
   * @throws {NotFoundError} - If the admin user is not found.
   * @throws {ValidationError} - If there is a validation error with the request.
   */
  @Post('admin/token')
  @Example<Option<OutputRefreshToken>>(
    {
      data: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Access token'
  )
  @Response<Option<OutputRefreshToken>>(
    '422',
    NETWORK_STATUS_MESSAGE.VALIDATE_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
    }
  )
  @Response<Option<OutputRefreshToken>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  public async refreshTokenAdmin(
    @Request() req: ExpressRequest,
    @Body() body: InputRefreshToken
  ): Promise<Option<OutputRefreshToken>> {
    try {
      const res = await Singleton.getAuthInstance().refreshToken(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Verifies the admin user's password.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputVerifyPassword} body - The body containt password.
   * @returns {Promise<Option<OutputVerifyPassword>>} - A promise that resolves to either an authentication token.
   * @throws {NotFoundError} - If the admin/user is not found.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('verify/password')
  @Security({
    authorization: []
  })
  @Middlewares([AuthMiddleware])
  @Example<Option<OutputVerifyPassword>>({
    data: {
      authorized: true
    },
    message: 'Success',
    count: 1,
    success: true
  })
  @Response<Option<OutputVerifyPassword>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputVerifyPassword>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async verifyPassword(
    @Request() req: ExpressRequest,
    @Body() body: InputVerifyPassword
  ): Promise<Option<OutputVerifyPassword>> {
    try {
      const address = req.headers.address as string
      const res = await Singleton.getAuthInstance().verifyPassword(
        body,
        address
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Logs out the admin/user.
   * @param {ExpressRequest} req - The Express request object.
   * @returns {Promise<Option<OutputLogout>>} - A promise that resolves to either an authentication token.
   * @throws {NotFoundError} - If the admin/user is not found.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('logout')
  @Middlewares([AuthMiddleware])
  @Example<Option<OutputLogout>>({
    data: {
      logout: true
    },
    message: 'Success',
    count: 1,
    success: true
  })
  @Response<Option<OutputLogout>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputLogout>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async logout(
    @Request() req: ExpressRequest
  ): Promise<Option<OutputLogout>> {
    try {
      const authorization = req.headers.authorization as string
      const res = await Singleton.getAuthInstance().logout(authorization)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('user/login/google')
  @Security({
    platform: []
  })
  @Example<Option<OutputLoginUser>>(
    {
      data: {
        detail: null,
        otp_code:
          '0x7d3bd16aed6e675cb8e5166bac938cca31c1f64c1abf211cc4a6cd2988c24203',
        access_token: null,
        refresh_token: null
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'OTP code'
  )
  @Example<Option<OutputLoginUser>>(
    {
      data: {
        detail: {
          id: 1,
          name: 'user',
          update_at: new Date(),
          create_at: new Date(),
          mnemonic:
            'U2FsdGVkX1/ABF7iuZOS4f7+76B1sdF1qRrhIMm8VOy6igU2eKRECdnJN9dTt7cCUuciUjy5L+bIFcIRKUS+lRnb3fFq110Acy0pRN+179Us0e0+0ItCoegPE/V8yqMC',
          role: 0,
          username: 'administrator',
          address: '0x3c90d8be4573f0582a2613e5cefe8727431db2f2',
          last_login_at: new Date(),
          view: '0'
        },
        otp_code: null,
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'User info'
  )
  @Response<Option<OutputLoginUser>>(
    '422',
    NETWORK_STATUS_MESSAGE.VALIDATE_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
    }
  )
  @Response<Option<OutputLoginUser>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputLoginUser>>(
    '404',
    NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND
    }
  )
  @Response<Option<OutputLoginUser>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async loginGoogle(
    @Body() payload: VerifyGoogleInput,
    @Request() req: ExpressRequest
  ): Promise<Option<OutputLoginUser>> {
    try {
      const res = await Singleton.getAuthInstance().verifyGoogle(
        payload.google_token_id
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Endpoint for submitting mnemonic for admin authentication.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputSubmitMnemonicAdmin} body - The request body containing the mnemonic.
   * @example body {
      "signature_payload": "string",
      "verify_code": "0x7d3bd16aed6e675cb8e5166bac938cca31c1f64c1abf211cc4a6cd2988c24203",
      "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB",
      "social_type": "google",
      "password": "12345678Aa@"
    }
   * @returns {Promise<Option<OutputSubmitUser>>} - A promise that resolves to an object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the admin information.
   * @throws {NotFoundError} - If the admin user is not found.
   * @throws {BadRequestError} - If the OTP code is invalid.
   * @throws {ValidationError} - If there is a validation error with the request.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('user/mnemonic')
  @Security({
    platform: []
  })
  @Example<Option<OutputSubmitUser>>(
    {
      data: {
        detail: {
          id: 1,
          name: 'user',
          update_at: new Date(),
          create_at: new Date(),
          mnemonic:
            'U2FsdGVkX1/ABF7iuZOS4f7+76B1sdF1qRrhIMm8VOy6igU2eKRECdnJN9dTt7cCUuciUjy5L+bIFcIRKUS+lRnb3fFq110Acy0pRN+179Us0e0+0ItCoegPE/V8yqMC',
          role: 1,
          username: 'administrator',
          address: '0x3c90d8be4573f0582a2613e5cefe8727431db2f2',
          last_login_at: new Date(),
          view: '0'
        },
        otp_code: null,
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'User info'
  )
  @Response<Option<OutputSubmitUser>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputSubmitUser>>(
    '404',
    NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND
    }
  )
  @Response<Option<OutputSubmitUser>>(
    '400',
    NETWORK_STATUS_MESSAGE.INVALID_VERIFY_CODE,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INVALID_VERIFY_CODE
    }
  )
  @Response<Option<OutputSubmitUser>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async submitMnemonicUser(
    @Request() req: ExpressRequest,
    @Body() body: InputSubmitMnemonicUser
  ): Promise<Option<OutputSubmitUser>> {
    try {
      /**
       * Submits the given body to the authentication instance's submitMnemonicAdmin method.
       */
      const res = await Singleton.getAuthInstance().submitMnemonicUser(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Refreshes the user authentication token.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputRefreshToken} body - The body containt refresh_token.
   * @returns {Promise<Option<string>>} - A promise that resolves to either an authentication token.
   * @throws {NotFoundError} - If the admin user is not found.
   * @throws {ValidationError} - If there is a validation error with the request.
   */
  @Post('user/token')
  @Example<Option<OutputRefreshToken>>(
    {
      data: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Access token'
  )
  @Response<Option<OutputRefreshToken>>(
    '422',
    NETWORK_STATUS_MESSAGE.VALIDATE_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
    }
  )
  @Response<Option<OutputRefreshToken>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  public async refreshTokenUser(
    @Request() req: ExpressRequest,
    @Body() body: InputRefreshToken
  ): Promise<Option<OutputRefreshToken>> {
    return await this.refreshTokenAdmin(req, body)
  }
}
