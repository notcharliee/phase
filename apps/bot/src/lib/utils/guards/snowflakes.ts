import { SnowflakeUtil } from "discord.js" // from @sapphire/snowflake

export function isSnowflake(id: string) {
  try {
    return SnowflakeUtil.deconstruct(id).timestamp > SnowflakeUtil.epoch
  } catch {
    return false
  }
}
