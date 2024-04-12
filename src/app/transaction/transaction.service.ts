import {
  type ITransaction,
  nft,
  nft_transaction,
  transaction,
  user
} from '@schemas'
import { Op, type WhereOptions } from 'sequelize'
import type { OutputTransactionHistory } from '@app'
class TransactionService {
  /**
   * Retrieves the transaction history for a given address.
   * @param {string} address - the address to retrieve the transaction history for.
   * @param {number} page - the page number of the results to retrieve.
   * @param {number} limit - the maximum number of results to retrieve per page.
   * @returns {Promise<OutputTransactionHistory>} - a promise that resolves to an array of transaction objects.
   */
  public async transactionHistory(
    address: string,
    page: number,
    limit: number
  ): Promise<OutputTransactionHistory> {
    const [userRes] = await user.findOrCreate({
      where: {
        address: address.toLowerCase()
      }
    })

    const whereCondition: WhereOptions<ITransaction> = {
      /**
       * An object that represents a logical OR operation between two conditions.
       * The conditions are that either the 'from' property of an object is equal to the given address
       * or the 'to' property of an object is equal to the given address.
       */
      [Op.or]: [{ user_id_from: userRes.id }, { user_id_to: userRes.id }]
    }
    /**
     * Finds all transactions that involve the given address and returns them in descending order
     * by creation date. The function also includes related user and NFT transaction data.
     */
    const { rows: transactionSql, count: transactionCount } =
      await transaction.findAndCountAll({
        distinct: true,
        where: whereCondition,
        attributes: {
          /**
           * An array of strings representing the fields to exclude from a database query or update.
           */
          exclude: [
            'delete_at',
            'update_at',
            'user_id_from',
            'user_id_to',
            'id',
            'synchronize_id'
          ]
        },
        /**
         * Specifies the order in which to sort the results of a database query.
         */
        order: [['create_at', 'DESC']],
        limit,
        offset: (page - 1) * limit,
        /**
         * Returns an array of objects that includes information about the sender, receiver, and
         * NFT transactions. The sender and receiver objects include the user's ID, address, and name.
         * The NFT transaction object includes information about the NFT, excluding the delete_at, update_at,
         * and id fields. The NFT transaction object also excludes the delete_at, update_at, id, and transaction_id fields.
         */
        include: [
          {
            model: user,
            as: 'from_user',
            attributes: ['id', 'address', 'name', 'username']
          },
          {
            model: user,
            as: 'to_user',
            attributes: ['id', 'address', 'name', 'username']
          },
          {
            model: nft_transaction,
            as: 'nft_transactions',
            include: [
              {
                model: nft,
                as: 'nft',
                attributes: {
                  exclude: ['delete_at', 'update_at', 'id', 'user_id']
                }
              }
            ],
            attributes: {
              exclude: [
                'delete_at',
                'update_at',
                'id',
                'transaction_id',
                'metadata'
              ]
            }
          }
        ]
      })
    return {
      data: transactionSql,
      total: transactionCount
    }
  }
}

export { TransactionService }
