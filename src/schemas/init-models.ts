import type { Sequelize } from 'sequelize'
import { token as _token } from './token'
import type { tokenAttributes, tokenCreationAttributes } from './token'
import { user as _user } from './user'
import type { userAttributes, userCreationAttributes } from './user'

export { _token as token, _user as user }

export type {
  tokenAttributes,
  tokenCreationAttributes,
  userAttributes,
  userCreationAttributes
}

export function initModels(sequelize: Sequelize) {
  const token = _token.initModel(sequelize)
  const user = _user.initModel(sequelize)

  token.belongsTo(user, { as: 'user', foreignKey: 'user_id' })
  user.hasMany(token, { as: 'tokens', foreignKey: 'user_id' })

  return {
    token,
    user
  }
}
