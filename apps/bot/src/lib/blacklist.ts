import { Entry, EntryType } from "@plugin/blacklist"

import type { BotClient } from "@phasejs/core/client"
import type { BlacklistPluginOptions } from "@plugin/blacklist"
import type { Snowflake } from "discord.js"

function populateBlacklist(phase: BotClient) {
  const configBlacklist = phase.stores.config.blacklist

  return [
    ...configBlacklist.guilds.map((entry): [Snowflake, Entry] => [
      entry.id,
      new Entry({
        id: entry.id,
        type: EntryType.Guild,
        reason: entry.reason,
      }),
    ]),
    ...configBlacklist.users.map((entry): [Snowflake, Entry] => [
      entry.id,
      new Entry({
        id: entry.id,
        type: EntryType.User,
        reason: entry.reason,
      }),
    ]),
  ]
}

export const blacklistOptions = {
  populate: populateBlacklist,
} satisfies BlacklistPluginOptions
