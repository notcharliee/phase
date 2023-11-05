import Redis from 'ioredis';

declare function createRedisInstance(config?: {
    host: string | undefined;
    password: string | undefined;
    port: string | undefined;
}): Redis;

export { createRedisInstance };
