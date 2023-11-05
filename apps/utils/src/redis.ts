import { Redis } from '@upstash/redis'


export const redisClient = (url: string, token: string) => {

  const redis = new Redis({ url, token })

  return redis

}