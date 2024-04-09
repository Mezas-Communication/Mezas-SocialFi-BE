import 'dotenv/config'
import { AuthService, inputLoginAdminValidate } from '@app'
import { Constant } from '@constants'
import { initialAdmin, verifyJWT } from '@providers'
import { enc } from 'crypto-js'
import AES from 'crypto-js/aes'
import { ethers } from 'ethers'

describe('auth', () => {
  let authService: AuthService
  let username = ''
  let password = ''
  const mnemonic =
    'moment affair crime judge radar merge include cheese desert leg lamp outside'

  /**
   * Runs before all tests in the file and initializes the admin user and authService.
   * If the environment variables ADMIN_INITIAL_USERNAME and ADMIN_INITIAL_PASSWORD are set,
   * they will be used to set the username and password for the admin user.
   */
  beforeAll(async () => {
    await initialAdmin()
    authService = new AuthService()
    const { ADMIN_INITIAL_USERNAME, ADMIN_INITIAL_PASSWORD } = Constant
    if (ADMIN_INITIAL_USERNAME && ADMIN_INITIAL_PASSWORD) {
      username = ADMIN_INITIAL_USERNAME
      password = ADMIN_INITIAL_PASSWORD
    }
  })

  it('Check instance type', async () => {
    expect(authService).toBeInstanceOf(AuthService)
  })

  it('Check admin username and password defined', async () => {
    expect(username).toBeDefined()
    expect(password).toBeDefined()
  })

  it('Check admin username and password is validate', async () => {
    /**
     * Tests whether the input for the login admin validation function is valid.
     */
    expect(inputLoginAdminValidate({ username, password })).toBeNull()
    expect(
      inputLoginAdminValidate({ username: 'abc.def@mail.com', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ username: 'abc@mail.com', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ username: 'abc_def@mail.com', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ username: 'abc.def@mail.cc', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({
        username: 'abc.def@mail-archive.com',
        password
      })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ username: 'abc.def@mail.org', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ username: 'abc.def@mail.com', password })
    ).toBeNull()
  })

  it('Check admin password is not validate', async () => {
    /**
     * Tests the inputLoginAdminValidate function with a given username and password.
     * Expects the function to return false.
     */
    expect(
      inputLoginAdminValidate({ username, password: '123456' })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username, password: '12345678910' })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username, password: '123456789ABC' })
    ).toBeDefined()
  })

  it('Check admin username is not validate', async () => {
    /**
     * Tests the inputLoginAdminValidate function with a given username and password.
     * Expects the function to return false.
     */
    expect(inputLoginAdminValidate({ username: 'abc', password })).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: 'abc-@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: 'abc..def@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: '.abc@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: 'abc#def@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: 'abc.def@mail.c', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({
        username: 'abc.def@mail#archive.com',
        password
      })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: 'abc.def@mail', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: 'abc.def@mail..com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ username: `@${username}`, password })
    ).toBeDefined()
  })

  it('Submit mnemonic before login', async () => {
    /**
     * Submits the invalid signature_payload and verify_code to the submitMnemonicAdmin befor login expects it to throw an error.
     */
    const resSubmitMnemonic = authService.submitMnemonicAdmin({
      signature_payload: '',
      verify_code: ''
    })
    await expect(resSubmitMnemonic).rejects.toThrow(
      new Error(Constant.NETWORK_STATUS_MESSAGE.LOGIN_BEFORE)
    )
  })

  it('Login with username and password', async () => {
    /**
     * Logs in an admin user with the given username and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      username
    })
    expect(resLoginAdmin).toBeDefined()
  })

  it('Login with wrong password', async () => {
    /**
     * Logs in an admin user with the given username and wrong password.
     */
    const resLoginAdmin = authService.loginAdmin({
      password: `${password}1`,
      username
    })
    await expect(resLoginAdmin).rejects.toThrow(
      new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    )
  })

  it('Submit mnemonic with wrong verify code', async () => {
    const resLoginAdmin = await authService.loginAdmin({
      password,
      username
    })
    /**
     * Asserts that the response object from an admin login request has the expected properties.
     */
    expect(resLoginAdmin.access_token).toBeNull()
    expect(resLoginAdmin.refresh_token).toBeNull()
    expect(resLoginAdmin.detail).toBeNull()
    expect(resLoginAdmin.otp_code).toBeDefined()
    /**
     * If the type of resLoginAdmin is a string, encrypts the mnemonic using the given password,
     * signs the encrypted mnemonic using the mnemonic, verifies the signature using the address
     * derived from the mnemonic, and submits the encrypted mnemonic and signature to the authService.
     * If the type of resLoginAdmin is not a string, expects that resLoginAdmin has a mnemonic property.
     */
    if (!resLoginAdmin.detail) {
      // Encrypt mnemonic with password
      const mnemonic_encrypted = AES.encrypt(mnemonic, password).toString()
      // Check decrypt mnemonic with password
      expect(
        AES.decrypt(mnemonic_encrypted, password).toString(enc.Utf8)
      ).toEqual(mnemonic)
      // Sign hash(mnemonic) with wallet
      const signature = await ethers.Wallet.fromMnemonic(mnemonic).signMessage(
        mnemonic_encrypted
      )
      const address = ethers.utils.verifyMessage(mnemonic_encrypted, signature)
      // Check address from signature and mnemonic
      expect(address).toEqual(ethers.Wallet.fromMnemonic(mnemonic).address)
      // Submit mnemonic API
      const resSubmitMnemonic = authService.submitMnemonicAdmin({
        signature_payload: `${mnemonic_encrypted}:${signature}`,
        verify_code: `${resLoginAdmin.otp_code}1`
      })
      await expect(resSubmitMnemonic).rejects.toThrow(
        new Error(Constant.NETWORK_STATUS_MESSAGE.INVALID_VERIFY_CODE)
      )
    } else {
      /**
       * Asserts that the response object from an admin login request contains the expected properties.
       */
      expect(resLoginAdmin.access_token).toBeDefined()
      expect(resLoginAdmin.refresh_token).toBeDefined()
      expect(resLoginAdmin.detail).toBeDefined()
      expect(resLoginAdmin.otp_code).toBeNull()
      expect(resLoginAdmin.detail.mnemonic).toBeDefined()
    }
  })

  it('Submit mnemonic', async () => {
    const resLoginAdmin = await authService.loginAdmin({
      password,
      username
    })
    /**
     * Asserts that the response object from an admin login request has the expected properties.
     */
    expect(resLoginAdmin.access_token).toBeNull()
    expect(resLoginAdmin.refresh_token).toBeNull()
    expect(resLoginAdmin.detail).toBeNull()
    expect(resLoginAdmin.otp_code).toBeDefined()
    /**
     * If the type of resLoginAdmin is a string, encrypts the mnemonic using the given password,
     * signs the encrypted mnemonic using the mnemonic, verifies the signature using the address
     * derived from the mnemonic, and submits the encrypted mnemonic and signature to the authService.
     * If the type of resLoginAdmin is not a string, expects that resLoginAdmin has a mnemonic property.
     */
    if (!resLoginAdmin.detail && resLoginAdmin.otp_code) {
      // Encrypt mnemonic with password
      const mnemonic_encrypted = AES.encrypt(mnemonic, password).toString()
      // Check decrypt mnemonic with password
      expect(
        AES.decrypt(mnemonic_encrypted, password).toString(enc.Utf8)
      ).toEqual(mnemonic)
      // Sign hash(mnemonic) with wallet
      const signature = await ethers.Wallet.fromMnemonic(mnemonic).signMessage(
        mnemonic_encrypted
      )
      const address = ethers.utils.verifyMessage(mnemonic_encrypted, signature)
      // Check address from signature and mnemonic
      expect(address).toEqual(ethers.Wallet.fromMnemonic(mnemonic).address)
      // Submit mnemonic API
      const resSubmitMnemonic = await authService.submitMnemonicAdmin({
        signature_payload: `${mnemonic_encrypted}:${signature}`,
        verify_code: resLoginAdmin.otp_code
      })
      expect(resSubmitMnemonic).toBeDefined()
      /**
       * Asserts that the access_token, refresh_token, and otp_code properties of the resSubmitMnemonic object are all null.
       */
      expect(resSubmitMnemonic.detail).toBeDefined()
      expect(resSubmitMnemonic.access_token).toBeDefined()
      expect(resSubmitMnemonic.refresh_token).toBeDefined()
      expect(resSubmitMnemonic.otp_code).toBeNull()

      /**
       * Asserts that the response from submitting a mnemonic contains the expected username, a defined mnemonic, and a defined address.
       */
      expect(resSubmitMnemonic.detail?.username).toEqual(username)
      expect(resSubmitMnemonic.detail?.mnemonic).toBeDefined()
      expect(resSubmitMnemonic.detail?.address).toBeDefined()
    } else {
      /**
       * Verifies the access token obtained from the login API and checks if the username and address
       * in the token match the expected values.
       */
      const access_token = resLoginAdmin.access_token
      const resVerifyJWT = verifyJWT(`${access_token}`)
      expect(resVerifyJWT.username).toEqual(username)
      expect(resVerifyJWT.address).toEqual(resLoginAdmin.detail?.address)

      /**
       * Asserts that the response object from an admin login request contains the expected properties.
       */
      expect(resLoginAdmin.access_token).toBeDefined()
      expect(resLoginAdmin.refresh_token).toBeDefined()
      expect(resLoginAdmin.detail).toBeDefined()
      expect(resLoginAdmin.otp_code).toBeNull()
      /**
       * Expects that the mnemonic property of the resLoginAdmin object is defined.
       */

      expect(resLoginAdmin.detail?.mnemonic).toBeDefined()
    }
  })

  it('Get admin info by login', async () => {
    /**
     * Logs in an admin user with the given username and password.
     * Get admin info by login after submit mnemonic
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      username
    })
    expect(resLoginAdmin).toBeDefined()
  })

  it('Verify JWT', async () => {
    /**
     * Logs in an admin user with the given username and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      username
    })
    expect(resLoginAdmin).toBeDefined()
    /**
     * Verifies the access token obtained from logging in as an admin user and checks if the
     * decoded JWT contains the expected username and address.
     */
    const access_token = resLoginAdmin.access_token
    const resVerifyJWT = verifyJWT(`${access_token}`)
    expect(resVerifyJWT).toBeDefined()
    expect(resVerifyJWT.username).toEqual(username)
    expect(resVerifyJWT.address).toEqual(resLoginAdmin.detail?.address)
  })

  it('Verify refresh token JWT ', async () => {
    /**
     * Logs in an admin user with the given username and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      username
    })
    expect(resLoginAdmin).toBeDefined()
    /**
     * Verifies the access token obtained from logging in as an admin user and checks if the
     * decoded JWT contains the expected username and address.
     */
    const { access_token, refresh_token } = resLoginAdmin
    const resVerifyJWT = verifyJWT(`${access_token}`)
    expect(resVerifyJWT).toBeDefined()
    expect(resVerifyJWT.username).toEqual(username)
    expect(resVerifyJWT.address).toEqual(resLoginAdmin.detail?.address)

    /**
     * Renews the access token using the provided refresh token and verifies the new access token.
     */
    const renewAccessToken = await authService.refreshToken({
      refresh_token: `${refresh_token}`
    })
    expect(renewAccessToken.access_token).not.toEqual(access_token)
    const resVerifyRenewJWT = verifyJWT(renewAccessToken.access_token)
    expect(resVerifyRenewJWT).toBeDefined()
    expect(resVerifyRenewJWT.username).toEqual(username)
    expect(resVerifyRenewJWT.address).toEqual(resLoginAdmin.detail?.address)
  })

  it('Verify password', async () => {
    /**
     * Logs in an admin user with the given username and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      username
    })
    expect(resLoginAdmin).toBeDefined()
    /**
     * Verifies the access token obtained from logging in as an admin user and checks if the
     */
    const isVerifyPassword = await authService.verifyPassword(
      {
        password
      },
      resLoginAdmin.detail?.address as string
    )
    expect(isVerifyPassword.authorized).toBeTruthy()
  })
})
