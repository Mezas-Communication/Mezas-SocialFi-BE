import * as Sequelize from 'sequelize'
import { DataTypes, Model, type Optional } from 'sequelize'
import type { user, userId } from './user'

export interface access_tokenAttributes {
  id: number
  token?: string
  create_at?: Date
  user_id: number
}

export type access_tokenPk = 'id'
export type access_tokenId = access_token[access_tokenPk]
export type access_tokenOptionalAttributes = 'id' | 'token' | 'create_at'
export type access_tokenCreationAttributes = Optional<
  access_tokenAttributes,
  access_tokenOptionalAttributes
>

export class access_token
  extends Model<access_tokenAttributes, access_tokenCreationAttributes>
  implements access_tokenAttributes
{
  id!: number
  token?: string
  create_at?: Date
  user_id!: number

  // access_token belongsTo user via user_id
  user!: user
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>

  static initModel(sequelize: Sequelize.Sequelize): typeof access_token {
    return access_token.init(
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
        tableName: 'access_token',
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
