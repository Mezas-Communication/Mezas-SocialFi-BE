import * as Sequelize from 'sequelize'
import { DataTypes, Model, type Optional } from 'sequelize'
import type { nft_transaction, nft_transactionId } from './nft_transaction'
import type { synchronize, synchronizeId } from './synchronize'
import type { user, userId } from './user'

export interface transactionAttributes {
  id: number
  transaction_hash: string
  synchronize_id: number
  value?: string
  update_at?: Date
  delete_at?: Date
  create_at?: Date
  block_number: number
  block_hash: string
  user_id_from: number
  user_id_to: number
}

export type transactionPk = 'id'
export type transactionId = transaction[transactionPk]
export type transactionOptionalAttributes =
  | 'id'
  | 'value'
  | 'update_at'
  | 'delete_at'
  | 'create_at'
export type transactionCreationAttributes = Optional<
  transactionAttributes,
  transactionOptionalAttributes
>

export class transaction
  extends Model<transactionAttributes, transactionCreationAttributes>
  implements transactionAttributes
{
  id!: number
  transaction_hash!: string
  synchronize_id!: number
  value?: string
  update_at?: Date
  delete_at?: Date
  create_at?: Date
  block_number!: number
  block_hash!: string
  user_id_from!: number
  user_id_to!: number

  // transaction belongsTo synchronize via synchronize_id
  synchronize!: synchronize
  getSynchronize!: Sequelize.BelongsToGetAssociationMixin<synchronize>
  setSynchronize!: Sequelize.BelongsToSetAssociationMixin<
    synchronize,
    synchronizeId
  >

  createSynchronize!: Sequelize.BelongsToCreateAssociationMixin<synchronize>
  // transaction hasMany nft_transaction via transaction_id
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
  // transaction belongsTo user via user_id_from
  user_id_from_user!: user
  getUser_id_from_user!: Sequelize.BelongsToGetAssociationMixin<user>
  setUser_id_from_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>
  createUser_id_from_user!: Sequelize.BelongsToCreateAssociationMixin<user>
  // transaction belongsTo user via user_id_to
  user_id_to_user!: user
  getUser_id_to_user!: Sequelize.BelongsToGetAssociationMixin<user>
  setUser_id_to_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>
  createUser_id_to_user!: Sequelize.BelongsToCreateAssociationMixin<user>

  static initModel(sequelize: Sequelize.Sequelize): typeof transaction {
    return transaction.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        transaction_hash: {
          type: DataTypes.STRING(66),
          allowNull: false
        },
        synchronize_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'synchronize',
            key: 'id'
          }
        },
        value: {
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
        block_number: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        block_hash: {
          type: DataTypes.STRING(66),
          allowNull: false
        },
        user_id_from: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          }
        },
        user_id_to: {
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
        tableName: 'transaction',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'transaction_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'transaction_pk',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'transaction_transaction_hash_uindex',
            unique: true,
            fields: [{ name: 'transaction_hash' }]
          }
        ]
      }
    )
  }
}
