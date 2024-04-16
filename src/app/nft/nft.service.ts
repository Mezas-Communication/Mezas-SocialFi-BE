import {
  OutputDetailNFT,
  OutputHistoryDetailNFT,
  OutputHistoryNFT,
  OutputOwn,
  RangeFields,
  SortFields,
  SortTypes
} from '@app'
import { Constant, NFTStatus } from '@constants'
import { INft, nft, nft_transaction, transaction, user } from '@schemas'
import { cast, col, fn, Op, where, WhereOptions } from 'sequelize'

class NftService {
  /**
   * The transaction modal.
   */
  private readonly sharedTransactionModel = {
    model: transaction,
    as: 'transaction',
    attributes: {
      exclude: ['delete_at', 'update_at', 'id', 'synchronize_id', 'from', 'to']
    },
    include: [
      {
        model: user,
        as: 'from_user',
        attributes: ['id', 'address', 'name', 'username']
      },
      {
        model: user,
        as: 'to_user',
        attributes: ['id', 'address', 'name', 'username']
      }
    ]
  }

  /**
   * The NFT modal.
   */
  private readonly sharedNFTModel = (slug: string) => ({
    model: nft,
    as: 'nft',
    where: {
      slug
    },
    attributes: {
      exclude: [
        'delete_at',
        'update_at',
        'id',
        'user_id',
        'token_id',
        'metadata',
        'create_at'
      ]
    }
  })

  /**
   * Retrieves the details of an NFT with the given token ID.
   * @param {string} tokenId - The token ID of the NFT to retrieve.
   * @returns {Promise<OutputDetailNFT>} - A promise that resolves to an object containing the details of the NFT.
   * @throws {Error} - If the NFT with the given token ID is not found.
   */
  public async detailNFT(slug: string): Promise<OutputDetailNFT> {
    const res = await nft.findOne({
      where: {
        /**
         * Parses the given tokenId string into an integer and assigns it to the token_id variable.
         */
        slug
      },
      attributes: [
        'metadata',
        'token_id',
        'create_at',
        'user_id',
        'status',
        'slug'
      ],
      /**
       * Includes the owner user model with the given attributes in the query.
       */
      include: [
        {
          model: user,
          as: 'owner_user',
          attributes: ['id', 'address', 'name', 'username']
        }
      ]
    })
    if (!res) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return res
  }

  /**
   * Retrieves a list of NFTs owned by the given address.
   * @param {string} address - The address of the owner of the NFTs.
   * @param {number} page - The page number of the results to retrieve.
   * @param {number} limit - The maximum number of results to retrieve per page.
   * @param {string} search - The search term to use to filter the results.
   * @param {SortFields} sortFields - The fields to sort the results by.
   * @param {SortTypes} sortType - The types to sort the results by.
   * @param {RangeFields} rangeFields - The fields to filter the results by.
   * @param {string[]} fromValues - The lower bounds of the range to filter the results by.
   * @param {string[]} toValues - The upper bounds of the range to filter the results by.
   * @returns {Promise<OutputOwn>} - A promise that resolves to an array of NFT objects.
   */
  public async ownNft(
    address: string,
    page: number,
    limit: number,
    search: string = '',
    sortFields: SortFields = ['create_at', 'title'],
    sortType: SortTypes = ['DESC', 'ASC'],
    rangeFields: RangeFields = [],
    fromValues: string[] = [],
    toValues: string[] = []
  ): Promise<OutputOwn> {
    const whereCondition: WhereOptions<INft> = [
      /**
       * Convert metadata field to varchar and query for a value that contains a given search string.
       */
      where(fn('lower', cast(col('metadata'), 'varchar')), {
        [Op.like]: `%${search}%`
      }),
      /**
       * Maps over an array of range fields and returns an object with the metadata properties
       * and their corresponding values that fall within the given range.
       */
      ...rangeFields.map((field, index) => {
        return {
          [`metadata.properties.${field}.value`]: {
            [Op.between]: [
              parseFloat(fromValues[index]),
              parseFloat(toValues[index])
            ]
          }
        }
      }),
      {
        status: NFTStatus.COMPLETED
      }
    ]
    if (address) {
      const [userRes] = await user.findOrCreate({
        where: {
          address
        }
      })
      whereCondition.push({
        user_id: userRes.id
      })
    }

    /**
     * Finds all NFTs owned by the given address and returns them as an array of objects.
     */
    const { rows: nftsSql, count: nftCount } = await nft.findAndCountAll({
      distinct: true,
      where: whereCondition,
      attributes: ['metadata', 'token_id', 'create_at', 'status', 'slug'],
      /**
       * Specifies the order in which to retrieve data from the database.
       */
      order: sortFields.map((field, index) => {
        if (field === 'title') {
          return [`metadata.${field}`, sortType[index]]
        }
        if (field === 'create_at') {
          return [field, sortType[index]]
        }
        return [`metadata.properties.${field}.value`, sortType[index]]
      }),
      limit,
      offset: (page - 1) * limit,
      /**
       * Includes the owner user model with the given attributes in the query.
       */
      include: [
        {
          model: user,
          as: 'owner_user',
          attributes: ['id', 'address', 'name', 'username']
        }
      ]
    })
    return {
      data: nftsSql,
      total: nftCount
    }
  }

  /**
   * Retrieves the history of a specific NFT with the given slug.
   * @param {string} slug - The slug of the NFT to retrieve.
   * @param {number} limit - The maximum number of results to retrieve per page.
   * @param {number} page - The page number of the results to retrieve.
   * @returns {Promise<OutputHistoryNFT>} - A promise that resolves to an object containing the details of the NFT.
   * @throws {Error} - If the NFT with the given token ID is not found.
   */
  public async historyNFT(
    slug: string,
    limit: number,
    page: number
  ): Promise<OutputHistoryNFT> {
    const { rows: res, count: total } = await nft_transaction.findAndCountAll({
      distinct: true,
      where: {
        /**
         * Filter only URIUpdated event.
         */
        event: {
          [Op.or]: [
            Constant.CONTRACT_EVENT.UPDATE,
            Constant.CONTRACT_EVENT.MINT
          ]
        },
        'metadata.version': {
          [Op.not]: null
        }
      },
      attributes: {
        /**
         * An array of strings representing the keys to exclude from an object.
         */
        exclude: ['nft_id', 'transaction_id', 'id']
      },
      /**
       * Includes the owner user model with the given attributes in the query.
       */
      include: [
        this.sharedNFTModel(slug),
        this.sharedTransactionModel,
        {
          model: user,
          as: 'owner_user',
          attributes: ['id', 'address', 'name', 'username']
        }
      ],
      order: [[transaction, 'create_at', 'DESC']],
      limit,
      offset: 1 + (page - 1) * limit
    })
    if (!res) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return {
      data: res,
      total: Math.max(total - 1, 0)
    }
  }

  /**
   * Retrieves the history of a specific NFT with the given slug and version.
   * @param {string} slug - The slug of the NFT to retrieve.
   * @param {number} limit - The maximum number of results to retrieve per page.
   * @param {number} page - The page number of the results to retrieve.
   * @returns {Promise<OutputHistoryNFT>} - A promise that resolves to an object containing the details of the NFT.
   * @throws {Error} - If the NFT with the given token ID is not found.
   */
  public async historyNFTDetail(
    slug: string,
    version: string
  ): Promise<OutputHistoryDetailNFT> {
    const res = await nft_transaction.findOne({
      /**
       * Filter only URIUpdated event.
       */
      where: [
        {
          event: {
            [Op.or]: [
              Constant.CONTRACT_EVENT.UPDATE,
              Constant.CONTRACT_EVENT.MINT
            ]
          }
        },
        {
          'metadata.version': {
            [Op.like]: `%${version}%`
          }
        }
      ],
      attributes: {
        /**
         * An array of strings representing the keys to exclude from an object.
         */
        exclude: ['nft_id', 'transaction_id', 'id']
      },
      /**
       * Includes the owner user model with the given attributes in the query.
       */
      include: [
        this.sharedNFTModel(slug),
        this.sharedTransactionModel,
        {
          model: user,
          as: 'owner_user',
          attributes: ['id', 'address', 'name', 'username']
        }
      ]
    })
    if (!res) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return res
  }
}

export { NftService }
