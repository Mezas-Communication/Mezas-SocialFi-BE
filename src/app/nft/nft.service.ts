import {
  OutputDetailNFT,
  OutputOwn,
  RangeFields,
  SortFields,
  SortTypes
} from '@app'
import { Constant, NFTStatus } from '@constants'
import { INft, nft, user } from '@schemas'
import { cast, col, fn, Op, where, WhereOptions } from 'sequelize'

class NftService {
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
}

export { NftService }
