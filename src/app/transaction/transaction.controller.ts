import type { OutputTransactionHistory } from '@app'
import type { Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Example,
  Get,
  Middlewares,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags
} from 'tsoa'

const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Transaction')
@Route('transactions')
@Middlewares([AuthMiddleware])
@Security({
  authorization: []
})
export class TransactionController extends Controller {
  /**
   * Retrieves the transaction history for a given user address.
   * @param {ExpressRequest} req - The Express request object.
   * @param {number} [page=1] - The page number to retrieve.
   * @param {number} [limit=10] - The number of transactions to retrieve per page.
   * @returns {Promise<Option<OutputTransactionHistory>>} - A Promise that resolves to an Option of ITransaction.
   * @throws {UnauthorizedError} - If the user is not authorized to access the information.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Get('history')
  @Example<Option<OutputTransactionHistory>>(
    {
      data: [
        {
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
          },
          nft_transactions: [
            {
              nft_id: 4,
              event: 'URI',
              nft: {
                token_id: 3,
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
                owner: '0x2d37599c7b05aae0e22f33482637f5d84213f07a'
              }
            }
          ]
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    },
    'Success'
  )
  @Response<Option<OutputTransactionHistory>>(
    '401',
    NETWORK_STATUS_MESSAGE.UNAUTHORIZED,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    }
  )
  @Response<Option<OutputTransactionHistory>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async transactionHistory(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<Option<OutputTransactionHistory>> {
    try {
      const { address } = req.headers
      const { data, total } =
        await Singleton.getTransactionInstance().transactionHistory(
          `${address}`,
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
