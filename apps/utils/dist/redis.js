"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/redis.ts
var redis_exports = {};
__export(redis_exports, {
  createRedisInstance: () => createRedisInstance
});
module.exports = __toCommonJS(redis_exports);
var import_ioredis = __toESM(require("ioredis"));
function createRedisInstance(config = {
  host: process.env.UPSTASH_HOST,
  password: process.env.UPSTASH_PASSWORD,
  port: process.env.UPSTASH_PORT
}) {
  try {
    const options = {
      host: config.host,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }
        return Math.min(times * 200, 1e3);
      }
    };
    if (config.port)
      options.port = Number(config.port);
    if (config.password)
      options.password = config.password;
    const redis = new import_ioredis.default(options);
    redis.on("error", (error) => {
      console.warn("[Redis] Error connecting", error);
    });
    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createRedisInstance
});
