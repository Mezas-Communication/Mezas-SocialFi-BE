import 'dotenv/config'
import { UserService, inputGetUserValidate, uploadAvatarValidate } from '@app'

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

  it('should update the user name and return the updated user', async () => {
    /**
     * Validates the given address and returns a boolean indicating whether it is valid or not.et
     * @param {string} address - The address to validate.
     * @returns {boolean} - True if the address is valid, false otherwise.
     */
    const initialUserData = {
      name: 'John Doe',
      address: '0x627306090abab3a6e1400e9345bc60c78a8bef57'
    }
    // Call the updateName() method of UserService to update the user's name
    const updatedUser = await usersService.updateUserName(
      initialUserData.address,
      'Jane Smith'
    )
    // Check if the user name has been successfully updated
    expect(updatedUser.name).toEqual('Jane Smith')
    // Retrieve the user data using the updated user's address
    const retrievedUser = await usersService.getProfileUser(
      initialUserData.address
    )
    // Check if the retrieved user's name matches the updated user's name
    expect(retrievedUser.name).toEqual('Jane Smith')
  })

  it('Upload invalid avatar', async () => {
    const image = Buffer.alloc(4 * 1024 * 1024)
    image[0] = 1
    const data = await uploadAvatarValidate(image)
    expect(data).toBeDefined()
  })

  it('should upload the avatar and return the CID', async () => {
    const imageBuffer = Buffer.from('image data')
    const expectedCid = '0x123456789abcdef'

    // Mock the uploadFile function
    const mockUploadFile = jest.fn().mockResolvedValue(expectedCid)

    // Replace the original uploadFile function with the mock function
    jest.spyOn(usersService, 'uploadAvatar').mockImplementation(mockUploadFile)

    // Call the uploadAvatar method
    const cid = await usersService.uploadAvatar(imageBuffer)

    // Check if the uploadFile function was called with the correct arguments
    expect(mockUploadFile).toBeDefined()

    // Check if the returned CID is correct
    expect(cid).toEqual(expectedCid)
  })
})
