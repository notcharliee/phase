// src/redis.ts
import { Redis } from "@upstash/redis";
var redisClient = (url, token) => {
  const redis = new Redis({ url, token });
  return redis;
};
export {
  redisClient
};
