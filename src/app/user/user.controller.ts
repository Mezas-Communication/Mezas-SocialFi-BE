import {
  inputGetUserValidate,
  OutputUpload,
  uploadAvatarValidate,
  validateUpdateUserName
} from '@app'
import { ErrorHandler, type Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import type { IUser } from '@schemas'
import { Request as ExpressRequest } from 'express'
import {
  BodyProp,
  Put,
  Post,
  Controller,
  Example,
  Get,
  Middlewares,
  Path,
  Request,
  Response,
  Route,
  Security,
  Tags,
  UploadedFile
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

  /**
   * Updates the name of the user profile.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} name - The new name for the user profile.
   * @returns {Promise<Option<IUser>>} - A Promise that resolves to an Option of the IUser object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Put('profile/update')
  @Example<Option<IUser>>(
    {
      data: {
        id: 18,
        username: 'jonh@gmail.com',
        address: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
        name: 'Jonh',
        avatar:
          '0xad6c1b10d79a8fd21b547cb74e4239d2f5e79105f2f1d6289306e988e5bf2c6a'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'User info'
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
  public async updateUser(
    @Request() req: ExpressRequest,
    @BodyProp() name?: string
  ): Promise<Option<IUser>> {
    try {
      const address = req.headers.address as string
      if (name) {
        const validate = validateUpdateUserName(name)
        if (validate) {
          throw new ErrorHandler(
            validate,
            Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
          )
        }
      }
      const updatedUser = await Singleton.getUserInstance().updateUserName(
        address,
        name
      )

      return onSuccess(updatedUser)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Retrieves the user profile information based on the provided Ethereum address.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} address - The Ethereum address of the user to retrieve information for.
   * @returns {Promise<Option<IUser>>} - A Promise that resolves to an Option of the IUser object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('profile/info')
  @Example<Option<IUser>>(
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
  public async getInfo(@Request() req: ExpressRequest): Promise<Option<IUser>> {
    try {
      const address = req.headers.address as string
      const res = await Singleton.getUserInstance().getProfileUser(address)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Uploads an avatar to the server and returns a response object.
   * @param {ExpressRequest} req - The Express request object.
   * @param {Express.Multer.File} image - The image file to upload.
   * @returns {Promise<Option<OutputUpload>>} - A Promise that resolves to an Option of the OutputUpload object.
   * @throws {UnauthorizedError} - If the user is not authorized to access the information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('profile/upload/avatar')
  @Example<Option<OutputUpload>>(
    {
      data: '0xad6c1b10d79a8fd21b547cb74e4239d2f5e79105f2f1d6289306e988e5bf2c6a',
      success: true,
      message: 'Success',
      count: 1
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
  public async uploadAvatar(
    @Request() req: ExpressRequest,
    @UploadedFile()
    image: Express.Multer.File
  ): Promise<Option<OutputUpload>> {
    try {
      /**
       * Validates the image.
       */
      const imageValidate = await uploadAvatarValidate(image.buffer)
      if (imageValidate) {
        throw new ErrorHandler(
          imageValidate,
          NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      const res = await Singleton.getUserInstance().uploadAvatar(image.buffer)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
