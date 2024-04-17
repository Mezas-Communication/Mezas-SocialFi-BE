import type { Sequelize } from 'sequelize'
import { image as _image } from './image'
import type { imageAttributes, imageCreationAttributes } from './image'
import { nft as _nft } from './nft'
import type { nftAttributes, nftCreationAttributes } from './nft'
import { nft_transaction as _nft_transaction } from './nft_transaction'
import type {
  nft_transactionAttributes,
  nft_transactionCreationAttributes
} from './nft_transaction'
import { synchronize as _synchronize } from './synchronize'
import type {
  synchronizeAttributes,
  synchronizeCreationAttributes
} from './synchronize'
import { token as _token } from './token'
import type { tokenAttributes, tokenCreationAttributes } from './token'
import { transaction as _transaction } from './transaction'
import type {
  transactionAttributes,
  transactionCreationAttributes
} from './transaction'
import { user as _user } from './user'
import type { userAttributes, userCreationAttributes } from './user'
import { posts as _posts } from './posts'
import type { postsAttributes, postsCreationAttributes } from './posts'

export {
  _image as image,
  _nft as nft,
  _nft_transaction as nft_transaction,
  _synchronize as synchronize,
  _token as token,
  _transaction as transaction,
  _user as user,
  _posts as posts
}

export type {
  imageAttributes,
  imageCreationAttributes,
  nftAttributes,
  nftCreationAttributes,
  nft_transactionAttributes,
  nft_transactionCreationAttributes,
  synchronizeAttributes,
  synchronizeCreationAttributes,
  tokenAttributes,
  tokenCreationAttributes,
  transactionAttributes,
  transactionCreationAttributes,
  userAttributes,
  userCreationAttributes,
  postsAttributes,
  postsCreationAttributes
}

export function initModels(sequelize: Sequelize) {
  const image = _image.initModel(sequelize)
  const nft = _nft.initModel(sequelize)
  const nft_transaction = _nft_transaction.initModel(sequelize)
  const synchronize = _synchronize.initModel(sequelize)
  const token = _token.initModel(sequelize)
  const transaction = _transaction.initModel(sequelize)
  const user = _user.initModel(sequelize)
  const posts = _posts.initModel(sequelize)

  nft_transaction.belongsTo(nft, { as: 'nft', foreignKey: 'nft_id' })
  nft.hasMany(nft_transaction, { as: 'nft_transactions', foreignKey: 'nft_id' })
  transaction.belongsTo(synchronize, {
    as: 'synchronize',
    foreignKey: 'synchronize_id'
  })
  synchronize.hasMany(transaction, {
    as: 'transactions',
    foreignKey: 'synchronize_id'
  })
  nft_transaction.belongsTo(transaction, {
    as: 'transaction',
    foreignKey: 'transaction_id'
  })
  transaction.hasMany(nft_transaction, {
    as: 'nft_transactions',
    foreignKey: 'transaction_id'
  })
  nft.belongsTo(user, { as: 'owner_user', foreignKey: 'user_id' })
  user.hasMany(nft, { as: 'nfts', foreignKey: 'user_id' })
  nft_transaction.belongsTo(user, { as: 'owner_user', foreignKey: 'user_id' })
  user.hasMany(nft_transaction, {
    as: 'nft_transactions',
    foreignKey: 'user_id'
  })
  token.belongsTo(user, { as: 'user', foreignKey: 'user_id' })
  user.hasMany(token, { as: 'tokens', foreignKey: 'user_id' })
  transaction.belongsTo(user, {
    as: 'from_user',
    foreignKey: 'user_id_from'
  })
  user.hasMany(transaction, { as: 'transactions', foreignKey: 'user_id_from' })
  transaction.belongsTo(user, {
    as: 'to_user',
    foreignKey: 'user_id_to'
  })
  user.hasMany(transaction, {
    as: 'to_transactions',
    foreignKey: 'user_id_to'
  })
  posts.belongsTo(user, { as: 'user', foreignKey: 'user_id' })
  user.hasMany(posts, { as: 'posts', foreignKey: 'user_id' })

  return {
    image: image,
    nft: nft,
    nft_transaction: nft_transaction,
    synchronize: synchronize,
    token: token,
    transaction: transaction,
    user: user,
    posts: posts
  }
}
