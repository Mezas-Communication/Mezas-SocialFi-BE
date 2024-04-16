import 'dotenv/config'
import {
  inputUploadJsonValidate,
  MetadataService,
  uploadImageValidate,
  type InputUploadJson
} from '@app'
import { initialAdmin } from '@providers'

describe('auth', () => {
  let metadataService: MetadataService

  let validMetadata: InputUploadJson

  beforeEach(() => {
    validMetadata = {
      type: 'hero',
      image: 'https://image.nft.xyz',
      title: 'NFT name',
      is_active_owner: true,
      properties: {
        class: {
          type: 'string',
          value: 'tanker',
          is_active: true
        },
        level: {
          type: 'number',
          value: 50,
          is_active: true
        },
        move_speed: {
          type: 'number',
          value: 80,
          is_active: true
        },
        attack_points: {
          type: 'number',
          value: 45,
          is_active: true
        },
        health_points: {
          type: 'number',
          value: 300,
          is_active: true
        },
        defender_points: {
          type: 'number',
          value: 25,
          is_active: true
        },
        win_count: {
          type: 'number',
          value: 72,
          is_active: true
        }
      }
    }
  })

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
    const data = await metadataService.readFile(
      '0x37c18fc02ebf2283a014035f84aadf82fc3e827acd6d21bc9a653433eb927089'
    )
    expect(data).toBeDefined()
  })

  /**
   * Uploads metadata to the metadata service.
   */
  it('Upload metadata', async () => {
    const data = await metadataService.uploadJson(validMetadata)
    expect(data).toBeDefined()
    expect(data).toEqual(
      '0x37c18fc02ebf2283a014035f84aadf82fc3e827acd6d21bc9a653433eb927089'
    )
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

  /**
   * Test validate metadata.
   */
  it('Validate metadata', async () => {
    const data = inputUploadJsonValidate(validMetadata)
    expect(data).toBeNull()
  })

  /**
   * Test validate metadata: title
   */
  it('Validate metadata: title', async () => {
    const invalidMetadataTitle = {
      ...validMetadata
    }
    invalidMetadataTitle.title =
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    expect(inputUploadJsonValidate(invalidMetadataTitle)).toBeDefined()
    invalidMetadataTitle.title = ''
    expect(inputUploadJsonValidate(invalidMetadataTitle)).toBeDefined()
  })

  /**
   * Test validate metadata: type
   */
  it('Validate metadata: type', async () => {
    const invalidMetadataType = {
      ...validMetadata
    }
    invalidMetadataType.type =
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    const data = inputUploadJsonValidate(invalidMetadataType)
    expect(data).toBeDefined()
  })

  /**
   * Test validate metadata: properties/class
   */
  it('Validate metadata: properties/class', async () => {
    const invalidMetadataClass = {
      ...validMetadata
    }
    invalidMetadataClass.properties.class.value =
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    const data = inputUploadJsonValidate(invalidMetadataClass)
    expect(data).toBeDefined()
  })

  /**
   * Test validate metadata: properties/level
   */
  it('Validate metadata: properties/level', async () => {
    const invalidMetadataLevel = {
      ...validMetadata
    }
    invalidMetadataLevel.properties.level.value = -1
    expect(inputUploadJsonValidate(invalidMetadataLevel)).toBeDefined()
    invalidMetadataLevel.properties.level.value = 10.123
    expect(inputUploadJsonValidate(invalidMetadataLevel)).toBeDefined()
  })

  /**
   * Test validate metadata: properties/move_speed
   */
  it('Validate metadata: properties/move_speed ', async () => {
    const invalidMetadataMoveSpeed = {
      ...validMetadata
    }
    invalidMetadataMoveSpeed.properties.attack_points.value = -1
    expect(inputUploadJsonValidate(invalidMetadataMoveSpeed)).toBeDefined()
  })

  /**
   * Test validate metadata: properties/attack_points
   */
  it('Validate metadata: properties/attack_points', async () => {
    const invalidMetadataAttackPoints = {
      ...validMetadata
    }
    invalidMetadataAttackPoints.properties.attack_points.value = -1
    expect(inputUploadJsonValidate(invalidMetadataAttackPoints)).toBeDefined()
  })

  /**
   * Test validate metadata: properties/health_points
   */
  it('Validate metadata: properties/health_points', async () => {
    const invalidMetadataHealthPoints = {
      ...validMetadata
    }
    invalidMetadataHealthPoints.properties.health_points.value = -1
    expect(inputUploadJsonValidate(invalidMetadataHealthPoints)).toBeDefined()
  })

  /**
   * Test validate metadata: properties/defender_points
   */
  it('Validate metadata: properties/defender_points', async () => {
    const invalidMetadataDefenderPoints = {
      ...validMetadata
    }
    invalidMetadataDefenderPoints.properties.defender_points.value = -1
    expect(inputUploadJsonValidate(invalidMetadataDefenderPoints)).toBeDefined()
  })

  /**
   * Test validate metadata: properties/win_count
   */
  it('Validate metadata: properties/win_count', async () => {
    const invalidMetadataWinCount = {
      ...validMetadata
    }
    invalidMetadataWinCount.properties.win_count.value = -1
    expect(inputUploadJsonValidate(invalidMetadataWinCount)).toBeDefined()
    invalidMetadataWinCount.properties.win_count.value = 1.1234577
    expect(inputUploadJsonValidate(invalidMetadataWinCount)).toBeDefined()
  })
})
