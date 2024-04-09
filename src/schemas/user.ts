import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { token, tokenId } from './token'

export interface userAttributes {
  id: number
  name?: string
  update_at?: Date
  delete_at?: Date
  create_at?: Date
  mnemonic?: string
  role?: number
  password?: string
  username?: string
  address?: string
  last_login_at?: Date
  avatar?: string
}

export type userPk = 'id'
export type userId = user[userPk]
export type userOptionalAttributes =
  | 'id'
  | 'name'
  | 'update_at'
  | 'delete_at'
  | 'create_at'
  | 'mnemonic'
  | 'role'
  | 'password'
  | 'username'
  | 'address'
  | 'last_login_at'
  | 'avatar'
export type userCreationAttributes = Optional<
  userAttributes,
  userOptionalAttributes
>

export class user
  extends Model<userAttributes, userCreationAttributes>
  implements userAttributes
{
  id!: number
  name?: string
  update_at?: Date
  delete_at?: Date
  create_at?: Date
  mnemonic?: string
  role?: number
  password?: string
  username?: string
  address?: string
  last_login_at?: Date
  avatar?: string

  // user hasMany token via user_id
  tokens!: token[]
  getTokens!: Sequelize.HasManyGetAssociationsMixin<token>
  setTokens!: Sequelize.HasManySetAssociationsMixin<token, tokenId>
  addToken!: Sequelize.HasManyAddAssociationMixin<token, tokenId>
  addTokens!: Sequelize.HasManyAddAssociationsMixin<token, tokenId>
  createToken!: Sequelize.HasManyCreateAssociationMixin<token>
  removeToken!: Sequelize.HasManyRemoveAssociationMixin<token, tokenId>
  removeTokens!: Sequelize.HasManyRemoveAssociationsMixin<token, tokenId>
  hasToken!: Sequelize.HasManyHasAssociationMixin<token, tokenId>
  hasTokens!: Sequelize.HasManyHasAssociationsMixin<token, tokenId>
  countTokens!: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        update_at: {
          type: DataTypes.DATE,
          allowNull: true
        },
        delete_at: {
          type: DataTypes.DATE,
          allowNull: true
        },
        create_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn('now')
        },
        mnemonic: {
          type: DataTypes.STRING,
          allowNull: true
        },
        role: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true
        },
        username: {
          type: DataTypes.STRING,
          allowNull: true
        },
        address: {
          type: DataTypes.STRING(42),
          allowNull: true
        },
        last_login_at: {
          type: DataTypes.DATE,
          allowNull: true
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'user',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'user_address_uindex',
            unique: true,
            fields: [{ name: 'address' }]
          },
          {
            name: 'user_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'user_mnemonic_uindex',
            unique: true,
            fields: [{ name: 'mnemonic' }]
          },
          {
            name: 'user_pk',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'user_username_uindex',
            unique: true,
            fields: [{ name: 'username' }]
          }
        ]
      }
    )
  }
}
