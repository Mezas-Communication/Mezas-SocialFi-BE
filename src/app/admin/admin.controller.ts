import type { Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import type { IUser } from '@schemas'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Example,
  Get,
  Middlewares,
  Request,
  Response,
  Route,
  Security,
  Tags
} from 'tsoa'
const { NETWORK_STATUS_MESSAGE } = Constant
@Tags('Admin')
@Route('admin')
@Middlewares([AuthMiddleware, AdminMiddleware])
@Security({
  authorization: []
})
export class AdminController extends Controller {
  /**
   * Retrieves information about the admin user.
   * @param {ExpressRequest} req - The Express request object.
   * @returns {Promise<Option<IUser>>} - A promise that resolves to an optional IUser object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the admin information.
   * @throws {ValidationError} - If there is a validation error with the request.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('info')
  @Example<Option<IUser>>(
    {
      data: {
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
      message: 'Success',
      count: 1,
      success: true
    },
    'Success'
  )
  @Response<Option<IUser>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IUser>>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<Option<IUser>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async infoAdmin(
    @Request() req: ExpressRequest
  ): Promise<Option<IUser>> {
    try {
      /**
       * Retrieves information about the given address from the admin instance.
       */
      const res = await Singleton.getAdminInstance().infoAdmin()
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
