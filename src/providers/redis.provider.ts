import { SetOptions, createClient } from 'redis'
import { Constant, logger } from '@constants'

class RedisUtils {
  private client = createClient({
    url: `redis://${Constant.REDIS_HOST}:6379`
  })

  public async connect(): Promise<void> {
    logger.info('Connecting to redis')
    await this.client.connect()
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  public async set(
    key: string,
    value: string,
    options?: SetOptions | undefined
  ): Promise<void> {
    void this.client.set(key, value, options)
  }
}

export { RedisUtils }
