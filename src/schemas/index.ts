import { Constant, logger } from '@constants'
import { initModels, userAttributes, tokenAttributes } from './init-models'
import { Sequelize } from 'sequelize'

/**
 * Destructures the environment variables for the database name, user, password, host, and port.
 */
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SCHEMA } = Constant

/**
 * Sets the timezone variable to the current timezone offset in the format of "+HH:MM" or "-HH:MM".
 */
let timezone = '+07:00'
const listMatch = new Date().toString().match(/([-+][0-9]+)\s/)
if (listMatch && listMatch.length > 1) {
  timezone = listMatch[1].trim()
}

/**
 * Creates a new Sequelize instance with the given configuration options.
 * @param {Object} options - The configuration options for the Sequelize instance.
 * @param {string} options.dialect - The dialect of the database to connect to.
 * @param {string} options.host - The host of the database to connect to.
 * @param {number} options.port - The port of the database to connect to.
 * @param {string} options.database - The name of the database to connect to.
 * @param {string} options.username - The username to use when connecting to the database.
 * @param {string} options.password - The password to use when connecting to the database.
 * @param {string} options.schema - The schema to use when connecting to the database.
 * @param {boolean} [options.logging=false
 */
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: sql =>
    logger.info({
      message: sql
    }),
  timezone,
  schema: DB_SCHEMA
})

/**
 * Initializes and returns the models for the given Sequelize instance.
 */
const { user, token } = initModels(sequelize)

/**
 * These type aliases are used to simplify the usage of the corresponding attribute interfaces.
 * IUser represents the userAttributes interface.
 */
type IUser = userAttributes
type IToken = tokenAttributes
export { user, type IUser, token, type IToken, sequelize }
