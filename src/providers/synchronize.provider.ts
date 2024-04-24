import { Constant, NFTStatus, getSlug, logger } from '@constants'
import {
  type ITransaction,
  nft,
  nft_transaction,
  synchronize,
  transaction,
  user
} from '@schemas'
import cron from 'node-cron'
import type { EventData } from 'web3-eth-contract/types'
import { nftContract, web3 } from '@providers'
import axios from 'axios'

/**
 * A global variable that can be accessed from anywhere in the code.
 * Note: Using global variables is generally not recommended as it can lead to
 * unexpected behavior and make the code harder to maintain.
 * @type {any}
 */
const globalVariable: any = global

globalVariable.isSyncingGetDataFromSmartContract = false
/**
 * Asynchronously retrieves data from a smart contract and synchronizes it with the database.
 */
const onJobGetDataFromSmartContract = async (is_test = false) => {
  try {
    /**
     * If the global variable 'isSyncingGetDataFromSmartContract' is true, return.
     * Otherwise, set 'isSyncingGetDataFromSmartContract' to true.
     */
    if (globalVariable.isSyncingGetDataFromSmartContract) return
    globalVariable.isSyncingGetDataFromSmartContract = true
    /**
     * Finds the last synchronized block in the database.
     */
    const lastSynchronize = await synchronize.findOne({
      order: [['last_block_number', 'DESC']],
      limit: 1
    })

    /**
     * If lastSynchronize is falsy, create a new synchronization record with a last_block_number of 0,
     * set globalVariable.isSyncingGetDataFromSmartContract to false, and return.
     */
    if (!lastSynchronize) {
      await synchronize.create({
        last_block_number: 5651872
      })
      globalVariable.isSyncingGetDataFromSmartContract = false
      return
    }
    /**
     * Increments the value of last_block_number by 1.
     */
    let last_block_number = lastSynchronize.last_block_number
    last_block_number += 1
    let listTxHash: string[] = []
    /**
     * Calculates the last block number on the blockchain by taking the minimum value between
     * the last block number plus 10000 and the current block number obtained from the web3 API.
     */
    const last_block_number_onchain = Math.min(
      last_block_number + 10000,
      await web3.eth.getBlockNumber()
    )
    /**
     * Synchronizes by sending a list of transaction hashes to the blockchain.
     */
    await synchronizeNFT(
      last_block_number,
      last_block_number_onchain,
      lastSynchronize.id,
      listTxHash,
      is_test
    )

    /**
     * If the list of transaction hashes is not empty, create a new synchronization record with the last block number on chain.
     * Log the number of transactions synchronized.
     * If the list of transaction hashes is empty and the difference between the last block number on chain and the last block number
     * is greater than 500, create a new synchronization record with the last block number on chain.
     */
    if (listTxHash.length > 0) {
      /**
       * If the code is running in a test environment and the length of the list of transaction hashes is greater than 2,
       * remove all elements from the list starting from the third element.
       */
      if (is_test && listTxHash.length > 2) {
        listTxHash.splice(2, listTxHash.length - 2)
      }
      await synchronize.create({
        last_block_number: last_block_number_onchain
      })
      /**
       * Removes duplicate elements from an array and returns a new array with unique elements.
       */
      listTxHash = [...new Set(listTxHash)]
      logger.info(
        `[onJobGetDataFromSmartContract] Synchronized ${listTxHash.length} transactions`
      )
    } else {
      if (last_block_number_onchain - last_block_number > 500) {
        await synchronize.create({
          last_block_number: last_block_number_onchain
        })
      }
    }
  } catch (error: any) {
    logger.error({
      message: `[onJobGetDataFromSmartContract]${error.message}${error.stack}`,
      error: error.message,
      stack: error.stack
    })
  }
  /**
   * A global boolean variable that indicates whether the application is currently syncing data from a smart contract.
   */
  globalVariable.isSyncingGetDataFromSmartContract = false
}

/**
 * Sorts an array of EventData objects by their block number and transaction index.
 * @param {EventData} a - The first EventData object to compare.
 * @param {EventData} b - The second EventData object to compare.
 * @returns {number} - Returns a negative number if a should come before b, a positive number if b should come before a, and 0 if they are equal.
 */
const sortByBlockNumberAndTransactionIndex = (a: EventData, b: EventData) => {
  if (a.blockNumber === b.blockNumber) {
    return a.transactionIndex - b.transactionIndex
  }
  return a.blockNumber - b.blockNumber
}

/**
 * Synchronizes the NFTs from the blockchain to the database.
 * @param {number} last_block_number_sync - The last block number that was synchronized.
 * @param {number} last_block_number_onchain - The last block number on the blockchain.
 * @param {number} synchronize_id - The ID of the synchronization.
 */
const synchronizeNFT = async (
  last_block_number_sync: number,
  last_block_number_onchain: number,
  synchronize_id: number,
  listTxHash: string[],
  is_test = false
) => {
  /**
   * Returns a configuration object for retrieving past events from a blockchain.
   *  last_block_number_sync - The block number to start retrieving events from.
   *  last_block_number_onchain - The block number to stop retrieving events at.
   */
  const getPastEventsConfig = {
    fromBlock: last_block_number_sync,
    toBlock: last_block_number_onchain
  }
  /**
   * Retrieves the past transfer events and update events for the NFT contract using the provided configuration.
   */
  const [
    // eventTransferNFT,
    eventUpdateNFT
  ] = await Promise.all([
    // nftContract.getPastEvents(
    //   Constant.CONTRACT_EVENT.TRANSFER,
    //   getPastEventsConfig
    // ),
    nftContract.getPastEvents(
      Constant.CONTRACT_EVENT.UPDATE,
      getPastEventsConfig
    )
  ])
  // listTxHash.push(...eventTransferNFT.map(e => e.transactionHash))
  listTxHash.push(...eventUpdateNFT.map(e => e.transactionHash))

  if (eventUpdateNFT.length > 0) {
    await synchronizeUpdateNFT(eventUpdateNFT, synchronize_id)
  }

  // if (eventTransferNFT.length > 0) {
  //   await synchronizeTransferAndMintNFT(
  //     eventTransferNFT,
  //     synchronize_id,
  //     is_test
  //   )
  // }
}

const synchronizeUpdateNFT = async (
  eventUpdateNFT: EventData[],
  synchronize_id: number
) => {
  /**
   * Sorts and maps an array of update NFT events to a new array of objects with additional properties.
   */
  const listUpdateNFT = eventUpdateNFT
    .sort(sortByBlockNumberAndTransactionIndex)
    .map(e => ({
      tokenId: e.returnValues.id,
      uri: e.returnValues.value,
      ...e
    }))
  logger.info(
    `[onJobGetDataFromSmartContract] Start synchronize:${eventUpdateNFT.length} NFT update events`
  )
  /**
   * Loops through a list of transferNFT objects and updates the corresponding SQL tables
   * with the relevant information.
   */
  for (const updateNFT of listUpdateNFT) {
    /**
     * Retrieves the transaction result for a given update of an NFT.
     */
    const txResult = await web3.eth.getTransaction(updateNFT.transactionHash)
    /**
     * Retrieves the timestamp of the block in which the given transaction was included.
     */
    const txTimestamp = await web3.eth.getBlock(
      txResult.blockNumber ? txResult.blockNumber : 'latest'
    )

    /**
     * Finds or creates a user with the given address from and to as zero address.
     */
    const [userFrom] = await user.findOrCreate({
      where: {
        address: txResult.from.toLowerCase()
      }
    })
    const [userTo] = await user.findOrCreate({
      where: {
        address: Constant.ZERO_ADDRESS
      }
    })
    /**
     * Finds or creates a transaction in the database with the given transaction hash and
     * adds the transaction details to the database.
     */

    let transactionSql = await transaction.findOne({
      where: {
        transaction_hash: updateNFT.transactionHash
      }
    })
    const transactionData: Omit<ITransaction, 'id'> = {
      transaction_hash: updateNFT.transactionHash,
      block_hash: updateNFT.blockHash,
      block_number: updateNFT.blockNumber,
      user_id_from: userFrom.id,
      user_id_to: userTo.id,
      synchronize_id,
      value: txResult.value,
      create_at: new Date(parseInt(`${txTimestamp.timestamp}`) * 1000)
    }
    if (!transactionSql) {
      transactionSql = await transaction.create(transactionData)
    } else {
      /**
       * Updates a transaction record in the database with the given data.
       */
      await transactionSql.update({
        ...(({ create_at, ...object }) => object)(transactionData),
        update_at: new Date()
      })
    }
    /**
     * Finds a single NFT in the database based on the provided token ID.
     */
    let nftSql = await nft.findOne({
      where: {
        token_id: parseInt(updateNFT.tokenId)
      }
    })
    /**
     * If nftSql is not defined, create a new NFT in the database with the given updateNFT data.
     * Otherwise, update the owner of the existing NFT in the database with the new owner from updateNFT.
     */
    // const uri = await nftContract.methods.uri(updateNFT.tokenId).call()

    const metadata = await axios.get(
      `https://ipfs.io/ipfs/QmXcrUWCfDEC5eXwFTWGqipT51dgGJhq54DgJY3MfoQ3f9/${updateNFT.tokenId}.json`
    )

    if (!nftSql) {
      nftSql = await nft.create({
        token_id: parseInt(updateNFT.tokenId),
        metadata: metadata.data,
        user_id: userTo.id,
        create_at: new Date(parseInt(`${txTimestamp.timestamp}`) * 1000),
        status: NFTStatus.COMPLETED,
        slug: getSlug(updateNFT.tokenId)
      })
    } else {
      try {
        await nft.update(
          {
            metadata: metadata.data,
            update_at: new Date(),
            status: NFTStatus.COMPLETED,
            slug: getSlug(updateNFT.tokenId)
          },
          {
            where: {
              token_id: parseInt(updateNFT.tokenId)
            }
          }
        )

        const [userOwner] = await user.findOrCreate({
          where: {
            address: Constant.OWNER_ADDRESS
          }
        })
        /**
         * Finds or creates a new NFT transaction in the database.
         */
        const is_nft_transaction_created = await nft_transaction.findOrCreate({
          where: {
            nft_id: nftSql.id,
            transaction_id: transactionSql.id
          },
          defaults: {
            nft_id: nftSql.id,
            transaction_id: transactionSql.id,
            event: Constant.CONTRACT_EVENT.UPDATE,
            metadata: metadata.data,
            user_id: userOwner.id
          }
        })
        if (!is_nft_transaction_created) {
          await nft_transaction.update(
            {
              metadata: metadata.data,
              user_id: userOwner.id
            },
            {
              where: {
                nft_id: nftSql.id,
                transaction_id: transactionSql.id
              }
            }
          )
        }
      } catch (errorUri: any) {
        logger.error(
          `[onJobGetDataFromSmartContract][listUpdateNFT][metadata]${errorUri.message}`
        )
      }
    }
  }
  logger.info(
    `[onJobGetDataFromSmartContract]End synchronize:${eventUpdateNFT.length} NFT events`
  )
}

// const synchronizeTransferAndMintNFT = async (
//   eventTransferNFT: EventData[],
//   synchronize_id: number,
//   is_test = false
// ) => {
//   /**
//    * If the code is running in a test environment and the length of the eventTransferNFT array is greater than 2,
//    * remove all elements from index 2 to the end of the array.
//    * @param {boolean} is_test - a boolean indicating whether the code is running in a test environment
//    * @param {Array} eventTransferNFT - an array of events
//    * @returns None
//    */
//   if (is_test && eventTransferNFT.length > 2) {
//     eventTransferNFT.splice(2, eventTransferNFT.length - 2)
//   }
//   logger.info(
//     `[onJobGetDataFromSmartContract] Start synchronize:${eventTransferNFT.length} NFT transfer events`
//   )
//   /**
//    * Sorts and maps an array of transfer NFT events to a new array of objects with additional properties.
//    */
//   const listTransferNFT = eventTransferNFT
//     .sort(sortByBlockNumberAndTransactionIndex)
//     .map(e => ({
//       tokenId: e.returnValues.tokenId,
//       from: e.returnValues.from,
//       to: e.returnValues.to,
//       ...e
//     }))
//   /**
//    * Loops through a list of transferNFT objects and updates the corresponding SQL tables
//    * with the relevant information.
//    */
//   for (const transferNFT of listTransferNFT) {
//     /**
//      * Retrieves the transaction result for a given transfer of an NFT.
//      */
//     const txResult = await web3.eth.getTransaction(transferNFT.transactionHash)
//     /**
//      * Retrieves the timestamp of the block in which the given transaction was included.
//      */
//     const txTimestamp = await web3.eth.getBlock(
//       txResult.blockNumber ? txResult.blockNumber : 'latest'
//     )
//     /**
//      * Finds or creates a user with the given address from and to.
//      */
//     const [userFrom] = await user.findOrCreate({
//       where: {
//         address: transferNFT.from.toLowerCase()
//       }
//     })
//     const [userTo] = await user.findOrCreate({
//       where: {
//         address: transferNFT.to.toLowerCase()
//       }
//     })
//     /**
//      * Finds or creates a transaction in the database with the given transaction hash and
//      * adds the transaction details to the database.
//      */

//     let transactionSql = await transaction.findOne({
//       where: {
//         transaction_hash: transferNFT.transactionHash
//       }
//     })
//     const transactionData: Omit<ITransaction, 'id'> = {
//       transaction_hash: transferNFT.transactionHash,
//       block_hash: transferNFT.blockHash,
//       block_number: transferNFT.blockNumber,
//       user_id_from: userFrom.id,
//       user_id_to: userTo.id,
//       synchronize_id,
//       value: txResult.value,
//       create_at: new Date(parseInt(`${txTimestamp.timestamp}`) * 1000)
//     }
//     if (!transactionSql) {
//       transactionSql = await transaction.create(transactionData)
//     } else {
//       await transactionSql.update({
//         ...(({ create_at, ...object }) => object)(transactionData),
//         update_at: new Date()
//       })
//     }
//     /**
//      * Finds a single NFT in the database based on the provided token ID.
//      */
//     let nftSql = await nft.findOne({
//       where: {
//         token_id: parseInt(transferNFT.tokenId)
//       }
//     })

//     const uri = await nftContract.methods.tokenURI(transferNFT.tokenId).call()
//     try {
//       const metadata = await axios.get(uri)
//       /**
//        * If nftSql is not defined, create a new NFT in the database with the given transferNFT data.
//        * Otherwise, update the owner of the existing NFT in the database with the new owner from transferNFT.
//        */
//       if (!nftSql) {
//         nftSql = await nft.create({
//           token_id: parseInt(transferNFT.tokenId),
//           metadata: metadata.data,
//           user_id: userTo.id,
//           create_at: new Date(parseInt(`${txTimestamp.timestamp}`) * 1000),
//           status: NFTStatus.COMPLETED,
//           slug: getSlug(transferNFT.tokenId)
//         })
//       } else {
//         nftSql.user_id = userTo.id
//         nftSql.status = NFTStatus.COMPLETED
//         nftSql.update_at = new Date()
//         nftSql.slug = getSlug(transferNFT.tokenId)
//         await nftSql.save()
//       }
//       /**
//        * Finds or creates a new NFT transaction in the database.
//        */

//       const metadataWithVersion = {
//         ...metadata.data,
//         ...(transferNFT.from.toLowerCase() === Constant.ZERO_ADDRESS
//           ? {
//               version: '1',
//               updateAt: txTimestamp.timestamp
//             }
//           : {})
//       }
//       const [, is_nft_transaction_created] = await nft_transaction.findOrCreate(
//         {
//           where: {
//             nft_id: nftSql.id,
//             transaction_id: transactionSql.id
//           },
//           defaults: {
//             nft_id: nftSql.id,
//             transaction_id: transactionSql.id,
//             event:
//               /**
//                * Determines the type of contract event based on the `from` address of a transferNFT object.
//                * If the `from` address is the zero address, the event is a mint. Otherwise, it is a transfer.
//                */
//               transferNFT.from.toLowerCase() === Constant.ZERO_ADDRESS
//                 ? Constant.CONTRACT_EVENT.MINT
//                 : Constant.CONTRACT_EVENT.TRANSFER,
//             metadata: metadataWithVersion,
//             user_id: userTo.id
//           }
//         }
//       )

//       if (!is_nft_transaction_created) {
//         await nft_transaction.update(
//           {
//             metadata: metadataWithVersion,
//             user_id: userTo.id
//           },
//           {
//             where: {
//               nft_id: nftSql.id,
//               transaction_id: transactionSql.id
//             }
//           }
//         )
//       }
//     } catch (errorUri: any) {
//       logger.error(
//         `[onJobGetDataFromSmartContract][listTransferNFT][metadata]${errorUri.message}`
//       )
//     }
//   }
//   logger.info(
//     `[onJobGetDataFromSmartContract]End synchronize:${listTransferNFT.length} NFT transfer events`
//   )
// }

const jobGetDataFromSmartContract = (_date: Date) => {
  onJobGetDataFromSmartContract().catch(error => {
    logger.error({
      message: `[onJobGetDataFromSmartContract]${error.message}${error.stack}`
    })
  })
}

/**
 * Starts cron jobs to synchronize data from a smart contract.
 * The first job runs every 5 seconds and calls the onJobGetDataFromSmartContract function.
 */
const startSynchronizeDataFromSmartContract = () => {
  /**
   * Schedules a cron job to run every 6 seconds to get data from a smart contract.
   */
  cron.schedule('*/5 * * * * *', jobGetDataFromSmartContract as any)
}

export { startSynchronizeDataFromSmartContract, onJobGetDataFromSmartContract }
