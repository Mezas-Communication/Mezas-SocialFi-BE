import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { nft_transaction, nft_transactionId } from './nft_transaction'
import type { user, userId } from './user'

export interface nftAttributes {
  id: number
  token_id: number
  metadata?: object
  create_at?: Date
  update_at?: Date
  delete_at?: Date
  status?: number
  user_id: number
  slug?: string
}

export type nftPk = 'id'
export type nftId = nft[nftPk]
export type nftOptionalAttributes =
  | 'id'
  | 'metadata'
  | 'create_at'
  | 'update_at'
  | 'delete_at'
  | 'status'
  | 'slug'
export type nftCreationAttributes = Optional<
  nftAttributes,
  nftOptionalAttributes
>

export class nft
  extends Model<nftAttributes, nftCreationAttributes>
  implements nftAttributes
{
  id!: number
  token_id!: number
  metadata?: object
  create_at?: Date
  update_at?: Date
  delete_at?: Date
  status?: number
  user_id!: number
  slug?: string

  // nft hasMany nft_transaction via nft_id
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
  // nft belongsTo user via user_id
  user!: user
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>

  static initModel(sequelize: Sequelize.Sequelize): typeof nft {
    return nft.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        token_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        metadata: {
          type: DataTypes.JSONB,
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
        },
        delete_at: {
          type: DataTypes.DATE,
          allowNull: true
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          }
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'nft',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'table_name_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'table_name_pk',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'table_name_token_id_uindex',
            unique: true,
            fields: [{ name: 'token_id' }]
          }
        ]
      }
    )
  }
}
