import { OutputDetailNFT } from '@app'
// import { AuthMiddleware } from '@middlewares'
import { Constant, type Option, logError, onError, onSuccess } from '@constants'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Example,
  Get,
  // Middlewares,
  Path,
  Request,
  Response,
  Route,
  // Security,
  Tags
} from 'tsoa'
import { Singleton } from '@providers'

const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('NFT')
@Route('nft')
// @Middlewares([AuthMiddleware])
// @Security({
//   authorization: []
// })
export class NftController extends Controller {
  /**
   * Retrieves the details of a specific NFT with the given slug.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} slug - The slug of the NFT to retrieve.
   * @returns {Promise<Option<OutputDetailNFT>>} - A Promise that resolves to an object containing the details of the NFT, or null if the NFT is not found.
   * @throws {UnauthorizedError} - If the user is not authorized to access this endpoint.
   * @throws {NotFoundError} - If the NFT is not found.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('{slug}')
  @Example<Option<OutputDetailNFT>>(
    {
      data: {
        token_id: 123,
        metadata: {
          type: 'hero',
          image: 'https://image.nft.xyz',
          title: 'NFT name',
          is_active_owner: true,
          properties: {
            rarity: {
              type: 'number',
              value: 3,
              is_active: true
            },
            class: {
              type: 'number',
              value: 2,
              is_active: true
            },
            level: {
              type: 'number',
              value: 50,
              is_active: true
            },
            move_speed: {
              type: 'number',
              value: 80,
              is_active: true
            },
            attack_points: {
              type: 'number',
              value: 45,
              is_active: true
            },
            health_points: {
              type: 'number',
              value: 300,
              is_active: true
            },
            defender_points: {
              type: 'number',
              value: 25,
              is_active: true
            },
            win_count: {
              type: 'number',
              value: 72,
              is_active: true
            }
          }
        },
        create_at: '2024-03-14T11:33:37.000Z',
        status: 0,
        slug: '81d9f25851af87',
        owner_user: {
          id: 1,
          address: '0x2d37599c7b05aae0e22f33482637f5d84213f07a',
          name: 'Duong',
          username: 'haiduong@gmail.com'
        }
      },
      success: true,
      message: 'Success',
      count: 1
    },
    'Success'
  )
  @Response<Option<OutputDetailNFT>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputDetailNFT>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputDetailNFT>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async detailNFT(
    @Request() req: ExpressRequest,
    @Path() slug: string
  ): Promise<Option<OutputDetailNFT>> {
    try {
      const data = await Singleton.getNftInstance().detailNFT(slug)
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
