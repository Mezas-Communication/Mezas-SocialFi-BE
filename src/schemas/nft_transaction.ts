/* eslint-disable @typescript-eslint/lines-between-class-members */
import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { nft, nftId } from './nft'
import type { transaction, transactionId } from './transaction'
import type { user, userId } from './user'

export interface nft_transactionAttributes {
  nft_id: number
  transaction_id: number
  event?: string
  id: number
  metadata?: object
  user_id?: number
}

export type nft_transactionPk = 'id'
export type nft_transactionId = nft_transaction[nft_transactionPk]
export type nft_transactionOptionalAttributes =
  | 'event'
  | 'id'
  | 'metadata'
  | 'user_id'
export type nft_transactionCreationAttributes = Optional<
  nft_transactionAttributes,
  nft_transactionOptionalAttributes
>

export class nft_transaction
  extends Model<nft_transactionAttributes, nft_transactionCreationAttributes>
  implements nft_transactionAttributes
{
  nft_id!: number
  transaction_id!: number
  event?: string
  id!: number
  metadata?: object
  user_id?: number

  // nft_transaction belongsTo nft via nft_id
  nft!: nft
  getNft!: Sequelize.BelongsToGetAssociationMixin<nft>
  setNft!: Sequelize.BelongsToSetAssociationMixin<nft, nftId>
  createNft!: Sequelize.BelongsToCreateAssociationMixin<nft>
  // nft_transaction belongsTo transaction via transaction_id
  transaction!: transaction
  getTransaction!: Sequelize.BelongsToGetAssociationMixin<transaction>
  setTransaction!: Sequelize.BelongsToSetAssociationMixin<
    transaction,
    transactionId
  >
  createTransaction!: Sequelize.BelongsToCreateAssociationMixin<transaction>
  // nft_transaction belongsTo user via user_id
  user!: user
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>

  static initModel(sequelize: Sequelize.Sequelize): typeof nft_transaction {
    return nft_transaction.init(
      {
        nft_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'nft',
            key: 'id'
          }
        },
        transaction_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'transaction',
            key: 'id'
          }
        },
        event: {
          type: DataTypes.STRING,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id'
          }
        }
      },
      {
        sequelize,
        tableName: 'nft_transaction',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'nft_transaction_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'nft_transaction_pk',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    )
  }
}
