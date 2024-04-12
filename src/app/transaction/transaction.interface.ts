import type { ITransaction } from '@schemas'

/**
 * An interface representing the output of a transaction history request.
 * @interface OutputTransactionHistory
 * @property {ITransaction[]} data - An array of transaction objects.
 * @property {number} total - The total number of transactions.
 */
export interface OutputTransactionHistory {
  data: ITransaction[]
  total: number
}
