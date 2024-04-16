import 'dotenv/config'
import { Sequelize } from 'sequelize'
import { readFileSync } from 'fs'
import { Constant } from '@constants'
import { onJobGetDataFromSmartContract } from '@providers'
global.beforeAll(async () => {
  /**
   * Destructures the environment variables for the database name, user, password, host, and port.
   */
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DB_SCHEMA } =
    Constant

  /**
   * Creates a new Sequelize instance with the given configuration options.
   * @param {Object} options - The configuration options for the Sequelize instance.
   * @param {string} options.dialect - The dialect of the database to connect to.
   * @param {string} options.host - The host of the database to connect to.
   * @param {number} options.port - The port of the database to connect to.
   * @param {string} options.database - The name of the database to connect to.
   * @param {string} options.username - The username to use when connecting to the database.
   * @param {string} options.password - The password to use when connecting to the database.
   */
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    timezone: '+07:00',
    schema: DB_SCHEMA
  })

  /**
   * Reads the SQL file that drops the database and executes it using Sequelize.
   */
  await sequelize.query(readFileSync('./src/db/drop.db.sql').toString('utf-8'))
  /**
   * Executes a SQL query to create a database using the SQL code in the specified file.
   */
  await sequelize.query(
    readFileSync('./src/db/create.db.sql').toString('utf-8')
  )

  /**
   * Initializes the synconize table.
   */
  await onJobGetDataFromSmartContract()
})
