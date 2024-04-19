import { OutputDetailPosts } from '@app'
import { type Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
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
   * Retrieves the details of a specific posts with the given slug.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} slug - The slug of the posts to retrieve.
   * @returns {Promise<Option<IPosts>>} - A Promise that resolves to an Option of the IPosts object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('{slug}')
  @Example<Option<OutputDetailPosts>>(
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
  @Response<Option<OutputDetailPosts>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputDetailPosts>>(
    '404',
    NETWORK_STATUS_MESSAGE.NOT_FOUND,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.NOT_FOUND
    }
  )
  @Response<Option<OutputDetailPosts>>(
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
  ): Promise<Option<OutputDetailPosts>> {
    try {
      const res = await Singleton.getPostsInstance().detailPosts(slug)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  // /**
  //  * Uploads an avatar to the server and returns a response object.
  //  * @param {ExpressRequest} req - The Express request object.
  //  * @param {Express.Multer.File} image - The image file to upload.
  //  * @returns {Promise<Option<OutputUpload>>} - A Promise that resolves to an Option of the OutputUpload object.
  //  * @throws {UnauthorizedError} - If the user is not authorized to access the information.
  //  * @throws {InternalServerError} - If there is an internal server error.
  //  */
  // @Post('posts')
  // @Example<Option<any>>(
  //   {
  //     data: '0xad6c1b10d79a8fd21b547cb74e4239d2f5e79105f2f1d6289306e988e5bf2c6a',
  //     success: true,
  //     message: 'Success',
  //     count: 1
  //   },
  //   'Success'
  // )
  // @Response<Option<any>>(
  //   '422',
  //   NETWORK_STATUS_MESSAGE.VALIDATE_ERROR,
  //   {
  //     success: false,
  //     message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  //   }
  // )
  // @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
  //   success: false,
  //   message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  // })
  // @Response<Option<any>>(
  //   '500',
  //   NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
  //   {
  //     success: false,
  //     message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  //   }
  // )
  // public async uploadPosts(
  //   @Request() req: ExpressRequest,
  //   @BodyProp() body: InputUploadPosts
  // ): Promise<Option<any>> {
  //   try {
  //     // /**
  //     //  * Validates the posts.
  //     //  */
  //     // const imageValidate = await uploadPostsValidate(image.buffer)
  //     // if (imageValidate) {
  //     //   throw new ErrorHandler(
  //     //     imageValidate,
  //     //     NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  //     //   )
  //     // }
  //     const res = await Singleton.getPostsInstance().uploadPosts(body)
  //     return onSuccess(res)
  //   } catch (error: any) {
  //     logError(error, req)
  //     return onError(error, this)
  //   }
  // }
}
