import { type Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import type { IPosts } from '@schemas'
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

@Tags('Posts')
@Route('Posts')
@Security({
  authorization: []
})
@Middlewares([AuthMiddleware])
export class UsersController extends Controller {
  /**
   * Retrieves the user profile information based on the provided Ethereum address.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} address - The Ethereum address of the user to retrieve information for.
   * @returns {Promise<Option<IPosts>>} - A Promise that resolves to an Option of the IPosts object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('{slug}')
  @Example<Option<IPosts>>(
    {
      data: {
        username: 'jonh@gmail.com',
        address: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
        avatar:
          '0xad6c1b10d79a8fd21b547cb74e4239d2f5e79105f2f1d6289306e988e5bf2c6a',
        name: 'Jonh'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'User info'
  )
  @Response<Option<IPosts>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IPosts>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<IPosts>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async detailPosts(
    @Request() req: ExpressRequest,
    @Path() slug: string
  ): Promise<Option<IPosts>> {
    try {
      const res = await Singleton.getPostsInstance().detailPosts(slug)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
