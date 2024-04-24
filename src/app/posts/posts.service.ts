import { InputUploadPosts, OutputDetailPosts } from '@app'
import { Constant } from '@constants'
import { posts, user } from '@schemas'
import { v4 as uuidv4 } from 'uuid'

class PostsService {
  /**
   * Retrieves the details of an posts with the given uuid.
   * @param {string} uuid - The uuid of the posts to retrieve.
   * @returns {Promise<OutputDetailPosts>} - A promise that resolves to an object containing the details of the posts.
   * @throws {Error} - If the posts with the given uuid is not found.
   */
  public async detailPosts(uuid: string): Promise<OutputDetailPosts> {
    const res = await posts.findOne({
      where: {
        /**
         * Parses the given uuid string into an integer and assigns it to the uuid variable.
         */
        uuid
      },
      attributes: [
        'user_id',
        'title',
        'content',
        'image_url',
        'views',
        'likes',
        'create_at',
        'uuid'
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

  public async uploadPosts(
    body: InputUploadPosts,
    address: string
  ): Promise<any> {
    const [userRes] = await user.findOrCreate({
      where: {
        address
      }
    })

    if (!userRes) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }
    const newPost = await posts.create({
      user_id: userRes.id,
      title: body.title,
      content: body.content,
      image_url: body.image_url,
      create_at: new Date(),
      uuid: uuidv4()
    })
    return newPost
  }
}

export { PostsService }
