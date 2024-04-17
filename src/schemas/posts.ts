import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import { user, userId } from './user'

export interface postsAttributes {
  id: number
  user_id?: number
  title?: string
  content?: string
  image_url?: string
  views?: number
  likes?: number
  create_at?: Date
  update_at?: Date
}

export type postsPk = 'id'
export type postsId = posts[postsPk]
export type postsOptionalAttributes =
  | 'id'
  | 'user_id'
  | 'title'
  | 'content'
  | 'image_url'
  | 'views'
  | 'likes'
  | 'create_at'
  | 'update_at'

export type postsCreationAttributes = Optional<
  postsAttributes,
  postsOptionalAttributes
>

export class posts
  extends Model<postsAttributes, postsCreationAttributes>
  implements postsAttributes
{
  id!: number
  user_id?: number | undefined
  title?: string | undefined
  content?: string | undefined
  image_url?: string | undefined
  views?: number | undefined
  likes?: number | undefined
  create_at?: Date | undefined
  update_at?: Date | undefined

  // posts belongsTo user via user_id
  user!: user
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>

  static initModel(sequelize: Sequelize.Sequelize): typeof posts {
    return posts.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          }
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        content: {
          type: DataTypes.STRING,
          allowNull: true
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: false
        },
        views: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        likes: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        create_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn('now')
        },
        update_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'posts',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'posts_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'posts_pk',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    )
  }
}