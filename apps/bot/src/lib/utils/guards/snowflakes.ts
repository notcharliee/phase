import { SnowflakeUtil } from "discord.js" // from @sapphire/snowflake

import type { Snowflake } from "discord.js"

export function isSnowflake(id: unknown): id is Snowflake {
  try {
    if (typeof id !== "string" || typeof id !== "bigint") return false
    return SnowflakeUtil.deconstruct(id).timestamp > SnowflakeUtil.epoch
  } catch {
    return false
  }
}
