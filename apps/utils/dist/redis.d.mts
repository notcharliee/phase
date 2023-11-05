import { Redis } from '@upstash/redis';

declare const redisClient: (url: string, token: string) => Redis;

export { redisClient };
