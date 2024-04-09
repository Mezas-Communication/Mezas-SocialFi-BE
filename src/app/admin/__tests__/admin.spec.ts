import 'dotenv/config'
import { initialAdmin } from '@providers'
import { enc } from 'crypto-js'
import AES from 'crypto-js/aes'
import { AdminService } from '@app'
import { Constant } from '@constants'

describe('admin', () => {
  /**
   * Declares variables for an admin service, username, password, and a mnemonic.
   */
  let adminService: AdminService
  let username = ''
  let password = ''
  const mnemonic =
    'moment affair crime judge radar merge include cheese desert leg lamp outside'

  /**
   * Runs before all tests in the file and initializes the admin user.
   */
  beforeAll(async () => {
    await initialAdmin()
    adminService = new AdminService()
    const { ADMIN_INITIAL_USERNAME, ADMIN_INITIAL_PASSWORD } = Constant
    if (ADMIN_INITIAL_USERNAME && ADMIN_INITIAL_PASSWORD) {
      username = ADMIN_INITIAL_USERNAME
      password = ADMIN_INITIAL_PASSWORD
    }
  })

  /**
   * Test to check if the adminService instance is of the correct type.
   */
  it('Check instance type', async () => {
    expect(adminService).toBeInstanceOf(AdminService)
  })

  /**
   * Checks if the admin username and password are defined.
   */
  it('Check admin username and password defined', async () => {
    expect(username).toBeDefined()
    expect(password).toBeDefined()
  })

  /**
   * Retrieves the admin information by signature and decrypts the mnemonic if it exists.
   */
  it('Get admin info by signature', async () => {
    /**
     * Retrieves the admin information for the given address.
     */
    const resLoginAdmin = await adminService.infoAdmin()
    expect(resLoginAdmin).toBeDefined()
    /**
     * Checks if the response from the server contains a mnemonic and if it does, decrypts it using the provided password and compares it to the expected mnemonic.
     */
    if (resLoginAdmin && !!resLoginAdmin.mnemonic) {
      // Decrypt mnemonic with password
      const mnemonic_decrypted = AES.decrypt(
        resLoginAdmin.mnemonic,
        password
      ).toString(enc.Utf8)
      // Check decrypt mnemonic with mnemonic
      expect(mnemonic_decrypted).toEqual(mnemonic)
    }
  })
})
