import { OutputDetailNFT } from '@app'
import { Constant } from '@constants'
import { nft, user } from '@schemas'

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
}

export { NftService }
