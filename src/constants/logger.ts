import type { Request, Response } from 'express'
import winston from 'winston'
/**
 * Creates a new instance of a Winston logger with the specified formats and transports.
 * @returns {Logger} - A new instance of a Winston logger.
 */
const logger = winston.createLogger({
  /**
   * An array of Winston transports that specify where logs should be sent.
   * @param {Console} new winston.transports.Console() - Sends logs to the console.
   * @param {LokiTransport} new LokiTransport() - Sends logs to Grafana Loki.
   */
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(log => {
          return `[${log.timestamp}] [${log.level}] ${log.message}`
        })
      )
    })
  ],
  levels: winston.config.npm.levels
})

/**
 * Logs the details of an HTTP request and response to the console.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {number} time - The time taken to process the request in milliseconds.
 */
const logRequest = (req: Request, res: Response, time: number) => {
  const { method, url, ip, headers, body, query } = req
  const { statusCode } = res
  const authorization = headers.authorization
  logger.info({
    message: `[${method}] ${url} ${ip} authorization=${authorization} body=${JSON.stringify(
      body
    )} query=${JSON.stringify(query)} status=${statusCode} time=${time}ms`,
    method,
    url,
    ip,
    authorization,
    body,
    query,
    duration: time,
    status: statusCode
  })
}

const logError = (err: Error, req: Request, prefix: string = '') => {
  const { method, url, ip, headers, body, query } = req
  const authorization = headers.authorization
  logger.error({
    message: `${prefix}[${method}] ${url} ${ip} authorization=${authorization} body=${JSON.stringify(
      body
    )} query=${JSON.stringify(query)}`,
    method,
    url,
    ip,
    authorization,
    body,
    query,
    error: err.message,
    stack: err.stack,
    prefix
  })
}

export { logger, logRequest, logError }
