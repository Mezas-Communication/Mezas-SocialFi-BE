import {
  inputOwnNftValidate,
  OutputDetailNFT,
  OutputHistoryDetailNFT,
  OutputHistoryNFT,
  OutputOwn,
  RangeFields,
  SortFields,
  SortTypes
} from '@app'
// import { AuthMiddleware } from '@middlewares'
import {
  Constant,
  ErrorHandler,
  type Option,
  logError,
  onError,
  onSuccess
} from '@constants'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Example,
  Get,
  // Middlewares,
  Path,
  Query,
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

  /**
   * Retrieves the NFTs owned by the user with the given address.
   * @param {ExpressRequest} req - The Express request object.
   * @param {number} [page=1] - The page number to retrieve.
   * @param {number} [limit=10] - The number of items to retrieve per page.
   * @param {string} [search=''] - The search term to filter by.
   * @param {SortFields} [sortFields=[]] - The fields to sort by `create_at`, `title` , `token_id` ,  `class`, `level`, `move_speed`, `attack_points`, `health_points`, `defender_points`, `win_count`.
   * @param {SortTypes} [sortType=[]] - The sort types to use `ASC` , `DESC`.
   * @param {RangeFields} [rangeFields=[]] - The fields to filter by `level`, `move_speed`, `attack_points`, `health_points`, `defender_points`, `win_count`.
   * @param {string[]} [fromValues=[]] - The lower bounds of the range to filter by.
   * @param {string[]} [toValues=[]] - The upper bounds of the range to filter by.
   * @returns {Promise<Option<OutputOwn>>} - A Promise that resolves to an Option of INft.
   * @throws {ValidationError} - If there is a validation error with the request.
   * @throws {UnauthorizedError} - If the user is not authorized to access information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('own')
  @Example<Option<OutputOwn>>(
    {
      data: [
        {
          token_id: 5,
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
                type: 'string',
                value: 'tanker',
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
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 101
    },
    'Success'
  )
  @Response<Option<OutputOwn>>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<Option<OutputOwn>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputOwn>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async ownNft(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() search: string = '',
    @Query() sortFields: string[] = ['create_at', 'title'],
    @Query() sortType: string[] = ['DESC', 'ASC'],
    @Query() rangeFields: string[] = [],
    @Query() fromValues: string[] = [],
    @Query() toValues: string[] = []
  ): Promise<Option<OutputOwn>> {
    try {
      /**
       * Validates the input parameters for the ownNft API call and throws an error if any of the parameters are invalid.
       */

      const validate = inputOwnNftValidate(
        page,
        limit,
        search,
        sortFields as SortFields,
        sortType as SortTypes,
        rangeFields as RangeFields,
        fromValues,
        toValues
      )
      if (validate) {
        throw new ErrorHandler(validate, NETWORK_STATUS_MESSAGE.VALIDATE_ERROR)
      }
      const { address } = req.headers
      /**
       * Retrieves the NFTs owned by the given address.
       */
      const { data, total } = await Singleton.getNftInstance().ownNft(
        `${address}`.toLowerCase(),
        page,
        limit,
        search,
        sortFields as SortFields,
        sortType as SortTypes,
        rangeFields as RangeFields,
        fromValues,
        toValues
      )
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Retrieves the history of a specific NFT with the given slug.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} slug - The slug of the NFT to retrieve.
   * @param {number} [page=1] - The page number to retrieve.
   * @param {number} [limit=10] - The number of items to retrieve per page.
   * @returns {Promise<Option<OutputHistoryNFT>>} - A Promise that resolves to an object containing the history of the NFT, or null if the NFT is not found.
   * @throws {UnauthorizedError} - If the user is not authorized to access this endpoint.
   * @throws {NotFoundError} - If the NFT is not found.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('{slug}/history')
  @Example<Option<OutputHistoryNFT>>(
    {
      data: [
        {
          event: 'Mint',
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
                type: 'string',
                value: 'tanker',
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
          transaction: {
            transaction_hash:
              '0x82987ed5cc71a0ab08ae10d4b1875deb66ecebe81646ff739b20a59167ec8ad4',
            value: '0',
            create_at: '2024-03-20T05:38:07.000Z',
            block_number: 500114,
            block_hash:
              '0x1d9fcd30fa40cb18f1c6f7bf8b382383293e1b0e3266bee21d9e8525127d5763',
            from_user: {
              id: 1,
              address: '0x2d37599c7b05aae0e22f33482637f5d84213f07a',
              name: 'Jonh',
              username: 'jonh@gmail.com'
            },
            to_user: {
              id: 6,
              address: '0xc13f9c195d45bd63361f36adc12589a36c13def9',
              name: 'Bob',
              username: 'Bob@gmail.com'
            }
          }
        }
      ],
      success: true,
      message: 'Success',
      count: 2,
      total: 2
    },
    'Success'
  )
  @Response<Option<OutputHistoryNFT>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputHistoryNFT>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputHistoryNFT>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async historyNFT(
    @Request() req: ExpressRequest,
    @Path() slug: string,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<Option<OutputHistoryNFT>> {
    try {
      const { data, total } = await Singleton.getNftInstance().historyNFT(
        slug,
        limit,
        page
      )
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Retrieves the of a specific NFT with the given tokenId and given version.
   * @param {ExpressRequest} req - The Express request object.
   * @param {string} slug - The slug of the NFT to retrieve.
   * @param {number} [page=1] - The page number to retrieve.
   * @param {number} [limit=10] - The number of items to retrieve per page.
   * @param {number} [version] - The version of the NFT to retrieve.
   * @returns {Promise<Option<OutputHistoryDetailNFT>>} - A Promise that resolves to an object containing the history of the NFT, or null if the NFT is not found.
   * @throws {UnauthorizedError} - If the user is not authorized to access this endpoint.
   * @throws {NotFoundError} - If the NFT is not found.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('{slug}/history/{version}')
  @Example<Option<OutputHistoryDetailNFT>>(
    {
      data: {
        event: 'UpdateURI',
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
              type: 'string',
              value: 'tanker',
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
        transaction: {
          transaction_hash:
            '0x82987ed5cc71a0ab08ae10d4b1875deb66ecebe81646ff739b20a59167ec8ad4',
          value: '0',
          create_at: '2024-03-20T05:38:07.000Z',
          block_number: 500114,
          block_hash:
            '0x1d9fcd30fa40cb18f1c6f7bf8b382383293e1b0e3266bee21d9e8525127d5763',
          from_user: {
            id: 1,
            address: '0x2d37599c7b05aae0e22f33482637f5d84213f07a',
            name: 'Jonh',
            username: 'jonh@gmail.com'
          },
          to_user: {
            id: 6,
            address: '0xc13f9c195d45bd63361f36adc12589a36c13def9',
            name: 'Bob',
            username: 'Bob@gmail.com'
          }
        }
      },
      success: true,
      message: 'Success',
      count: 1
    },
    'Success'
  )
  @Response<Option<OutputHistoryDetailNFT>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputHistoryDetailNFT>>(
    '404',
    NETWORK_STATUS_MESSAGE.NOT_FOUND,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.NOT_FOUND
    }
  )
  @Response<Option<OutputHistoryDetailNFT>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async historyNFTDetail(
    @Request() req: ExpressRequest,
    @Path() slug: string,
    @Path() version: string
  ): Promise<Option<OutputHistoryDetailNFT>> {
    try {
      const data = await Singleton.getNftInstance().historyNFTDetail(
        slug,
        version
      )
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
