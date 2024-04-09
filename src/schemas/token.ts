import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { user, userId } from './user'

export interface tokenAttributes {
  id: number
  token?: string
  create_at?: Date
  user_id: number
}

export type tokenPk = 'id'
export type tokenId = token[tokenPk]
export type tokenOptionalAttributes = 'id' | 'token' | 'create_at'
export type tokenCreationAttributes = Optional<
  tokenAttributes,
  tokenOptionalAttributes
>

export class token
  extends Model<tokenAttributes, tokenCreationAttributes>
  implements tokenAttributes
{
  id!: number
  token?: string
  create_at?: Date
  user_id!: number

  // token belongsTo user via user_id
  user!: user
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>

  static initModel(sequelize: Sequelize.Sequelize): typeof token {
    return token.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        create_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn('now')
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          }
        }
      },
      {
        sequelize,
        tableName: 'token',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'access_token_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'access_token_pk',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    )
  }
}
