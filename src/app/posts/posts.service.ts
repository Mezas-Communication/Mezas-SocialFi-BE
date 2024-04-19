import { OutputDetailPosts } from '@app'
import { Constant } from '@constants'
import { posts, user } from '@schemas'

class PostsService {
  /**
   * Retrieves the details of an posts with the given posts_id.
   * @param {string} posts_id - The posts_id of the posts to retrieve.
   * @returns {Promise<OutputDetailPosts>} - A promise that resolves to an object containing the details of the posts.
   * @throws {Error} - If the posts with the given posts_id is not found.
   */
  public async detailPosts(posts_id: string): Promise<OutputDetailPosts> {
    const res = await posts.findOne({
      where: {
        /**
         * Parses the given posts_id string into an integer and assigns it to the posts_id variable.
         */
        id: posts_id
      },
      attributes: [
        'user_id',
        'title',
        'content',
        'image_url',
        'views',
        'likes',
        'create_at'
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

export { PostsService }
