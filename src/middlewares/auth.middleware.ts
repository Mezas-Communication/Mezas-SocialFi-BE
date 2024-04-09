import { Constant, logError, onError } from '@constants'
import { hashText, verifyJWT } from '@providers'
import { token, user } from '@schemas'
import { ethers } from 'ethers'
import { type NextFunction, type Request, type Response } from 'express'
const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant

/**
 * Middleware function that checks if the request has a valid authorization header and
 * verifies the signature of the request.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }

    const tokenInDB = await token.findOne({
      where: {
        token: hashText(authorization)
      }
    })

    if (!tokenInDB) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }
    /**
     * Verifies the authorization token using the JWT_SECRET environment variable and extracts the address from the token.
     */
    const payload = verifyJWT(authorization)

    if (!payload.address) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }

    const address = payload.address.toLowerCase()
    /**
     * Checks if the given address is a valid Ethereum address using the ethers library.
     * If the address is not valid, returns a JSON response with a bad request error message.
     */
    if (!ethers.utils.isAddress(address)) {
      return res
        .status(NETWORK_STATUS_CODE.BAD_REQUEST)
        .json(onError(NETWORK_STATUS_MESSAGE.BAD_REQUEST))
    }
    req.headers.address = address.toLowerCase()
    next()
  } catch (error: any) {
    token
      .destroy({
        where: {
          token: hashText(`${req.headers?.authorization}`)
        }
      })
      .catch(err => {
        logError(err, req, '[AuthMiddleware][token.destroy]')
      })
    logError(error, req, '[AuthMiddleware]')
    return res
      .status(NETWORK_STATUS_CODE.EXPIRE)
      .json(onError(NETWORK_STATUS_MESSAGE.EXPIRE))
  }
}

/**
 * Middleware function that checks if the user making the request is an admin.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const AdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { address } = req.headers

    if (!address) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }
    /**
     * Finds a user in the database with the given address and role of "admin".
     */
    const userRes = await user.findOne({
      where: {
        address,
        role: Constant.USER_ROLE.ADMIN
      }
    })
    /**
     * Checks if the user response exists. If it does not exist, returns an error response
     * with a status code of 401 (Unauthorized).
     */
    if (!userRes) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }
    next()
  } catch (error: any) {
    logError(error, req, '[AdminMiddleware]')
    return res
      .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
      .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
  }
}
export { AdminMiddleware, AuthMiddleware }
