import 'dotenv/config'
import { MetadataService, uploadImageValidate } from '@app'
import { initialAdmin } from '@providers'

describe('auth', () => {
  let metadataService: MetadataService

  beforeAll(async () => {
    await initialAdmin()
    metadataService = new MetadataService()
  })

  it('Check instance type', async () => {
    expect(metadataService).toBeInstanceOf(MetadataService)
  })

  /**
   * Test function to get metadata from a file using the metadataService.
   */
  it('Get metadata', async () => {
    const data = await metadataService.readFileS3(
      '0x37c18fc02ebf2283a014035f84aadf82fc3e827acd6d21bc9a653433eb927089'
    )
    expect(data).toBeDefined()
  })

  /**
   * Uploads an large image to the metadata service.
   */
  it('Upload invalid image', async () => {
    const image = Buffer.alloc(4 * 1024 * 1024)
    image[0] = 1
    const data = await uploadImageValidate(image)
    expect(data).toBeDefined()
  })
})
