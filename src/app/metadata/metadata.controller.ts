import {
  type OutputRead,
  type OutputUpload,
  uploadImageValidate,
  type OutputGetImages
} from '@app'
import {
  Constant,
  ErrorHandler,
  logError,
  onError,
  onSuccess,
  type Option
} from '@constants'
import { AdminMiddleware, AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Example,
  Get,
  Middlewares,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
  UploadedFile
} from 'tsoa'
const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Metadata')
@Route('metadata')
export class MetadataController extends Controller {
  /**
   * Uploads an image to the server and returns a response object.
   * @param {ExpressRequest} req - The Express request object.
   * @param {Express.Multer.File} image - The image file to upload.
   * @returns {Promise<Option<OutputUpload>>} - A Promise that resolves to an object containing the uploaded image data.
   * @throws {UnauthorizedError} - If the user is not authorized to upload images.
   * @throws {ValidateError} - If there is an error validating the image.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('admin/upload/image')
  @Security({
    authorization: []
  })
  @Middlewares([AuthMiddleware, AdminMiddleware])
  @Example<Option<OutputUpload>>(
    {
      data: '0xad6c1b10d79a8fd21b547cb74e4239d2f5e79105f2f1d6289306e988e5bf2c6a',
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    },
    'Success'
  )
  @Response<Option<OutputUpload>>(
    '422',
    NETWORK_STATUS_MESSAGE.VALIDATE_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
    }
  )
  @Response<Option<OutputUpload>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputUpload>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async uploadImage(
    @Request() req: ExpressRequest,
    @UploadedFile()
    image: Express.Multer.File
  ): Promise<Option<OutputUpload>> {
    try {
      /**
       * Validates the image.
       */
      const imageValidate = await uploadImageValidate(image.buffer)
      if (imageValidate) {
        throw new ErrorHandler(
          imageValidate,
          NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      const res = await Singleton.getMetadataInstance().uploadImage(
        image.buffer
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Retrieves a file with the given cid and returns it as a response.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} cid - The cid of the file to retrieve.
   * @example cid "0xad6c1b10d79a8fd21b547cb74e4239d2f5e79105f2f1d6289306e988e5bf2c6a"
   * @returns {Promise<Option<OutputRead>>} - A Promise that resolves to an Option of OutputRead.
   * @throws {ValidateError} - If there is an error validating the image.
   * @throws {InternalServerError} - If there is an internal server error.
   * @throws {NotFoundError} - If the file is not found.
   */
  @Get('{cid}')
  @Example<OutputRead>(null, 'Success')
  @Response<Option<OutputRead>>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<Option<OutputRead>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputRead>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async readFile(
    @Request() req: ExpressRequest,
    @Path() cid: string
  ): Promise<Option<OutputRead>> {
    try {
      const res = await Singleton.getMetadataInstance().readFile(cid)
      if (req.res) {
        /**
         * Sends the response to the client and ends the request-response cycle.
         */
        req.res.end(res)
      }
      return onSuccess()
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Retrieves a file with the given cid and returns it as a response.
   * @param {ExpressRequest} req - The Express request object.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @example page 1
   * @example limit 20
   * @returns {Promise<Option<OutputRead>>} - A Promise that resolves to an Option of OutputRead.
   * @throws {ValidateError} - If there is an error validating the image.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('images/list')
  @Middlewares([AuthMiddleware, AdminMiddleware])
  @Security({
    authorization: []
  })
  @Example<OutputRead>(
    {
      data: [
        {
          id: 1,
          url: '0x3ca78e22b2c18e0021752020a4240830b012615a06c5006242e82c47092de799'
        },
        {
          id: 2,
          url: '0x47b85140c7539942c64313a118916f6b8f9f1f8d20020bd29031cfe774ea5aa4'
        }
      ],
      success: true,
      message: 'Success',
      count: 2,
      total: 2
    },
    'Success'
  )
  @Response<Option<OutputRead>>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<Option<OutputRead>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async getImages(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 20
  ): Promise<Option<OutputGetImages>> {
    try {
      const { data, total } = await Singleton.getMetadataInstance().getImages(
        page,
        limit
      )
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
