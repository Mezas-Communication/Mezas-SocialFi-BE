import { inputGetUserValidate } from '@app'
import { ErrorHandler, type Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import type { IUser } from '@schemas'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Example,
  Get,
  Middlewares,
  Path,
  Request,
  Response,
  Route,
  Security,
  Tags
} from 'tsoa'
const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('User')
@Route('users')
@Security({
  authorization: []
})
@Middlewares([AuthMiddleware])
export class UsersController extends Controller {
  /**
   * Retrieves user information based on the provided Ethereum address.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} address - The Ethereum address of the user to retrieve information for.
   * @returns {Promise<Option<IUser>>} - A Promise that resolves to an Option of the IUser object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('{address}')
  @Example<Option<IUser>>(
    {
      data: {
        id: 18,
        username: 'jonh@gmail.com',
        address: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
        name: 'Jonh',
        role: 0
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'User info'
  )
  @Example<Option<IUser>>(
    {
      data: {
        id: 1,
        username: 'administrator',
        address: '0x3c90d8be4573f0582a2613e5cefe8727431db2f2',
        name: 'admin',
        role: 1
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Admin'
  )
  @Response<Option<IUser>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IUser>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<IUser>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async getInfoByAddress(
    @Request() req: ExpressRequest,
    @Path() address: string
  ): Promise<Option<IUser>> {
    try {
      /**
       * Validates the given address using the inputGetUserValidate function and throws an error
       * if the validation fails.
       */
      const validate = inputGetUserValidate(address)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      const res = await Singleton.getUserInstance().getUser(
        address.toLowerCase()
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
