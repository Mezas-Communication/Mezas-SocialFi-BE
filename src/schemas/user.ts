/* eslint-disable @typescript-eslint/lines-between-class-members */
import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { nft, nftId } from './nft'
import type { nft_transaction, nft_transactionId } from './nft_transaction'
import type { token, tokenId } from './token'
import type { transaction, transactionId } from './transaction'
import { posts, postsId } from './posts'

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

  // user hasMany nft via user_id
  nfts!: nft[]
  getNfts!: Sequelize.HasManyGetAssociationsMixin<nft>
  setNfts!: Sequelize.HasManySetAssociationsMixin<nft, nftId>
  addNft!: Sequelize.HasManyAddAssociationMixin<nft, nftId>
  addNfts!: Sequelize.HasManyAddAssociationsMixin<nft, nftId>
  createNft!: Sequelize.HasManyCreateAssociationMixin<nft>
  removeNft!: Sequelize.HasManyRemoveAssociationMixin<nft, nftId>
  removeNfts!: Sequelize.HasManyRemoveAssociationsMixin<nft, nftId>
  hasNft!: Sequelize.HasManyHasAssociationMixin<nft, nftId>
  hasNfts!: Sequelize.HasManyHasAssociationsMixin<nft, nftId>
  countNfts!: Sequelize.HasManyCountAssociationsMixin
  // user hasMany nft_transaction via user_id
  nft_transactions!: nft_transaction[]
  getNft_transactions!: Sequelize.HasManyGetAssociationsMixin<nft_transaction>
  setNft_transactions!: Sequelize.HasManySetAssociationsMixin<
    nft_transaction,
    nft_transactionId
  >
  addNft_transaction!: Sequelize.HasManyAddAssociationMixin<
    nft_transaction,
    nft_transactionId
  >
  addNft_transactions!: Sequelize.HasManyAddAssociationsMixin<
    nft_transaction,
    nft_transactionId
  >
  createNft_transaction!: Sequelize.HasManyCreateAssociationMixin<nft_transaction>
  removeNft_transaction!: Sequelize.HasManyRemoveAssociationMixin<
    nft_transaction,
    nft_transactionId
  >
  removeNft_transactions!: Sequelize.HasManyRemoveAssociationsMixin<
    nft_transaction,
    nft_transactionId
  >
  hasNft_transaction!: Sequelize.HasManyHasAssociationMixin<
    nft_transaction,
    nft_transactionId
  >
  hasNft_transactions!: Sequelize.HasManyHasAssociationsMixin<
    nft_transaction,
    nft_transactionId
  >
  countNft_transactions!: Sequelize.HasManyCountAssociationsMixin
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
  // user hasMany transaction via user_id_from
  transactions!: transaction[]
  getTransactions!: Sequelize.HasManyGetAssociationsMixin<transaction>
  setTransactions!: Sequelize.HasManySetAssociationsMixin<
    transaction,
    transactionId
  >
  addTransaction!: Sequelize.HasManyAddAssociationMixin<
    transaction,
    transactionId
  >
  addTransactions!: Sequelize.HasManyAddAssociationsMixin<
    transaction,
    transactionId
  >
  createTransaction!: Sequelize.HasManyCreateAssociationMixin<transaction>
  removeTransaction!: Sequelize.HasManyRemoveAssociationMixin<
    transaction,
    transactionId
  >
  removeTransactions!: Sequelize.HasManyRemoveAssociationsMixin<
    transaction,
    transactionId
  >
  hasTransaction!: Sequelize.HasManyHasAssociationMixin<
    transaction,
    transactionId
  >
  hasTransactions!: Sequelize.HasManyHasAssociationsMixin<
    transaction,
    transactionId
  >
  countTransactions!: Sequelize.HasManyCountAssociationsMixin
  // user hasMany transaction via user_id_to
  user_id_to_transactions!: transaction[]
  getUser_id_to_transactions!: Sequelize.HasManyGetAssociationsMixin<transaction>
  setUser_id_to_transactions!: Sequelize.HasManySetAssociationsMixin<
    transaction,
    transactionId
  >
  addUser_id_to_transaction!: Sequelize.HasManyAddAssociationMixin<
    transaction,
    transactionId
  >
  addUser_id_to_transactions!: Sequelize.HasManyAddAssociationsMixin<
    transaction,
    transactionId
  >
  createUser_id_to_transaction!: Sequelize.HasManyCreateAssociationMixin<transaction>
  removeUser_id_to_transaction!: Sequelize.HasManyRemoveAssociationMixin<
    transaction,
    transactionId
  >
  removeUser_id_to_transactions!: Sequelize.HasManyRemoveAssociationsMixin<
    transaction,
    transactionId
  >
  hasUser_id_to_transaction!: Sequelize.HasManyHasAssociationMixin<
    transaction,
    transactionId
  >
  hasUser_id_to_transactions!: Sequelize.HasManyHasAssociationsMixin<
    transaction,
    transactionId
  >
  countUser_id_to_transactions!: Sequelize.HasManyCountAssociationsMixin
  // user hasMany posts via user_id
  posts!: posts[]
  getPosts!: Sequelize.HasManyGetAssociationsMixin<posts>
  setPosts!: Sequelize.HasManySetAssociationsMixin<posts, postsId>
  addPost!: Sequelize.HasManyAddAssociationMixin<posts, postsId>
  addPosts!: Sequelize.HasManyAddAssociationsMixin<posts, postsId>
  createPost!: Sequelize.HasManyCreateAssociationMixin<posts>
  removePost!: Sequelize.HasManyRemoveAssociationMixin<posts, postsId>
  removePosts!: Sequelize.HasManyRemoveAssociationsMixin<posts, postsId>
  hasPost!: Sequelize.HasManyHasAssociationMixin<posts, postsId>
  hasPosts!: Sequelize.HasManyHasAssociationsMixin<posts, postsId>
  countPosts!: Sequelize.HasManyCountAssociationsMixin
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
