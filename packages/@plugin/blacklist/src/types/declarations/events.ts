import type { Guild } from "discord.js"
import type { Entry } from "~/structures/Entry"

import type {} from "@phasejs/core"

declare module "@phasejs/core" {
  interface BotClientEvents {
    // entry events
    "blacklist.entryCreate": Entry
    "blacklist.entryDelete": Entry
    "blacklist.entryEdit": Entry
    // join events
    "blacklist.joinPrevented": Entry
    "blacklist.joinSuccess": Guild
  }
}
