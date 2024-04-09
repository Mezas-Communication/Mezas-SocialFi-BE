import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { transaction, transactionId } from './transaction'

export interface synchronizeAttributes {
  id: number
  last_block_number: number
  update_at?: Date
  delete_at?: Date
  create_at?: Date
}

export type synchronizePk = 'id'
export type synchronizeId = synchronize[synchronizePk]
export type synchronizeOptionalAttributes =
  | 'id'
  | 'update_at'
  | 'delete_at'
  | 'create_at'
export type synchronizeCreationAttributes = Optional<
  synchronizeAttributes,
  synchronizeOptionalAttributes
>

export class synchronize
  extends Model<synchronizeAttributes, synchronizeCreationAttributes>
  implements synchronizeAttributes
{
  id!: number
  last_block_number!: number
  update_at?: Date
  delete_at?: Date
  create_at?: Date

  // synchronize hasMany transaction via synchronize_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof synchronize {
    return synchronize.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        last_block_number: {
          type: DataTypes.INTEGER,
          allowNull: false
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
        }
      },
      {
        sequelize,
        tableName: 'synchronize',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'synchronize_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'synchronize_pk',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    )
  }
}
