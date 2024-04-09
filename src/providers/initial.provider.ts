import { Constant, logger } from '@constants'
import { sequelize, user } from '@schemas'
import { hashText } from '@providers'
import { readFileSync } from 'fs'
import path from 'path'

/**
 * Initializes the admin user with the given initial username and password if it does not already exist.
 */
const initialAdmin = async () => {
  /**
   * Destructures the ADMIN_INITIAL_PASSWORD and ADMIN_INITIAL_USERNAME from the Constant object.
   * These values are environment variables that are used to set the initial username and password for the admin user.
   */
  const { ADMIN_INITIAL_PASSWORD, ADMIN_INITIAL_USERNAME } = Constant
  /**
   * Finds a user in the database with the given username.
   */
  const res = await user.findOne({
    where: {
      username: ADMIN_INITIAL_USERNAME
    }
  })
  /**
   * Checks if an initial admin user exists in the database. If not, creates one using the
   * ADMIN_INITIAL_USERNAME and hash of ADMIN_INITIAL_PASSWORD environment variables.
   */
  if (!res) {
    if (ADMIN_INITIAL_PASSWORD) {
      await user.create({
        username: ADMIN_INITIAL_USERNAME,
        password: hashText(ADMIN_INITIAL_PASSWORD),
        role: Constant.USER_ROLE.ADMIN
      })
    }
  } else {
    logger.info(
      `initialAdmin already exist: ${Constant.ADMIN_INITIAL_USERNAME}`
    )
  }
}

/**
 * Initializes the database with the given initial database schema.
 */
const initialDatabase = async () => {
  /**
   * Executes a SQL query to retrieve the schema name from the information_schema.schemata table.
   */
  const [results] = await sequelize.query(
    `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${Constant.DB_SCHEMA}';`
  )
  /**
   * Checks if the length of the results array is greater than 0 to determine if a schema exists.
   */
  const isSchemaExist = results.length > 0
  if (!isSchemaExist) {
    /**
     * Reads the contents of the 'create.db.sql' file and executes the SQL query using Sequelize.
     * @param {string} path - The path to the 'create.db.sql' file.
     */
    await sequelize.query(
      readFileSync(
        path.join(__dirname, '/../db/create.db.sql').replace('build', '')
      ).toString('utf-8')
    )
  }
}

export { initialAdmin, initialDatabase }
