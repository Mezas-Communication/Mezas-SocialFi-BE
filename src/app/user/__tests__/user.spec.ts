import 'dotenv/config'
import { UserService, inputGetUserValidate } from '@app'

describe('user', () => {
  let usersService: UserService
  let address = ''
  beforeEach(() => {
    usersService = new UserService()
    address = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
  })

  it('Check instance type', async () => {
    expect(usersService).toBeInstanceOf(UserService)
  })

  it('Check valid wallet address', async () => {
    /**
     * Validates the given address and returns a boolean indicating whether it is valid or not.
     * @param {string} address - The address to validate.
     * @returns {boolean} - True if the address is valid, false otherwise.
     */
    const validAddress = inputGetUserValidate(address)
    expect(validAddress).toBeNull()
  })

  it('Check invalid wallet address', async () => {
    // Invalid address length
    const invalidAddressLength = inputGetUserValidate(`${address}1`)

    // No z value in hex
    const invalidAddressFormat = inputGetUserValidate(address.replace('6', 'z'))

    expect(invalidAddressLength).toBeDefined()
    expect(invalidAddressFormat).toBeDefined()
  })
})
