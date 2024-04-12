import 'dotenv/config'
import { TransactionService } from '@app'

describe('transaction', () => {
  let transactionService: TransactionService
  let address = ''
  beforeAll(() => {
    transactionService = new TransactionService()
    address = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
  })

  it('Get history transaction', async () => {
    /**
     * Retrieves the transaction history for a given address.
     * @param {string} address - The address to retrieve transaction history for.
     * @param {number} page - The page number of the transaction history to retrieve.
     * @param {number} limit - The maximum number of transactions to retrieve per page.
     * @returns {Promise} A promise that resolves to the transaction history for the given address.
     */
    const historyTx = await transactionService.transactionHistory(
      address,
      1,
      10
    )
    expect(historyTx.data).toBeDefined()
    expect(historyTx.total).toBeDefined()
  })
})
