import { Constant, NFT_ABI } from '@constants'
import { ethers } from 'ethers'
import Web3 from 'web3'

/**
 * Creates a new instance of the Web3 class using the provided blockchain URL.
 * @param {string} BLOCKCHAIN_URL - the URL of the blockchain to connect to.
 * @returns A new instance of the Web3 class.
 */
const web3 = new Web3(Constant.BLOCKCHAIN_URL)
const etherProvider = new ethers.providers.JsonRpcProvider(
  Constant.BLOCKCHAIN_URL
)

/**
 * Creates a new contract instance using the provided ABI and address.
 * @param {any} abi - The ABI (Application Binary Interface) of the contract.
 * @param {string} address - The address of the contract on the blockchain.
 * @returns A new contract instance.
 */
const newContract = (abi: any, address: string) => {
  return new web3.eth.Contract(abi, address)
}

/**
 * Hashes the given text using the SHA3 algorithm provided by the web3 library.
 * @param {string} text - The password to be hashed.
 * @returns {string} - The hashed password.
 */
const hashText = (text: string) => web3.utils.sha3(text) as string

/**
 * Creates a new instance of a NFT contract using the provided ABI and address.
 */
const nftContract = newContract(NFT_ABI.abi, NFT_ABI.address)

const isTransactionSuccess = async (payload: {
  from: string
  to: string
  data: string
}): Promise<boolean> => {
  try {
    return !!(await etherProvider.estimateGas(payload))
  } catch (error) {
    return false
  }
}

export { web3, newContract, hashText, nftContract, isTransactionSuccess }
