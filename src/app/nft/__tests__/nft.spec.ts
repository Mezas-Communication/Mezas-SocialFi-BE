import 'dotenv/config'
import { NftService, inputOwnNftValidate } from '@app'

describe('nft', () => {
  let nftService: NftService
  let address = ''
  beforeAll(() => {
    nftService = new NftService()
    address = '0x2d37599c7b05aae0e22f33482637f5d84213f07a'
  })

  it('List nft transaction', async () => {
    /**
     * Retrieves a list of NFTs owned by the given address, sorted by creation date and token ID.
     * @param {string} address - The address of the owner of the NFTs.
     * @param {number} page - The page number of the results to retrieve.
     * @param {number} limit - The maximum number of results to retrieve per page.
     * @param {string} search - A search string to filter the results by.
     * @param {Array<string>} orderBy - An array of fields to order the results by.
     * @param {Array<string>} orderDirection - An array of directions to order the results by.
     * @param {Array<string>} filterBy - An array of fields to filter the
     */
    const nftsOwn = await nftService.ownNft(
      address,
      1,
      10,
      '',
      ['title', 'create_at', 'token_id', 'win_count'],
      ['DESC', 'ASC', 'DESC', 'ASC'],
      ['level'],
      ['0'],
      ['1000']
    )
    expect(nftsOwn.data).toBeDefined()
    expect(nftsOwn.total).toBeDefined()
  })

  it('Valid get list nft', async () => {
    /**
     * Checks if the given input is valid for the get list nft endpoint.
     */
    expect(
      inputOwnNftValidate(
        1,
        10,
        '',
        ['title', 'create_at', 'token_id', 'win_count'],
        ['DESC', 'ASC', 'DESC', 'ASC'],
        ['level'],
        ['0'],
        ['1000'],
        address
      )
    ).toBeNull()
  })

  it('Invalid get list nft', async () => {
    /**
     * Must be invalid at sort field
     */
    expect(
      inputOwnNftValidate(
        1,
        10,
        '',
        ['title', 'create_at'],
        ['DESC', 'ASC', 'DESC', 'ASC'],
        ['level'],
        ['0'],
        ['1000'],
        address
      )
    ).toBeDefined()

    /**
     * Must be invalid at search field
     */
    expect(
      inputOwnNftValidate(
        0,
        10,
        'A'.repeat(266),
        ['title', 'create_at'],
        ['DESC', 'ASC'],
        ['level'],
        ['0'],
        ['1000'],
        address
      )
    ).toBeDefined()
  })

  it('NFT detail', async () => {
    /**
     * Retrieves the details of an NFT with the given ID from the NFT service.
     */
    const data = await nftService.detailNFT('4fe61e1a9fb1d1')
    expect(data).toBeDefined()
  })

  it('NFT history detail', async () => {
    /**
     * Retrieves the details of an NFT with the given ID from the NFT service.
     */
    const { data, total } = await nftService.historyNFT('4fe61e1a9fb1d1', 10, 1)
    expect(total).toBeDefined()
    expect(data).toBeDefined()
  })

  it('NFT history detail version', async () => {
    /**
     * Retrieves the details of an NFT with the given ID from the NFT service.
     */
    const data = await nftService.historyNFTDetail('4fe61e1a9fb1d1', '1')
    expect(data).toBeDefined()
  })
})
