import { BotCronBuilder, BotEventBuilder } from "@phasejs/builders"
import { BotPlugin } from "@phasejs/core/client"

import { version } from "~/lib/utils"

import { Blacklist } from "~/structures/Blacklist"

import type { BotEvent } from "@phasejs/core/client"
import type { BlacklistPluginOptions } from "~/types/plugin"

const blacklistCheckEvent = new BotEventBuilder()
  .setName("guildCreate")
  .setExecute(async (client, guild) => {
    const blacklist = client.blacklist
    const emitter = client.phase.emitter

    const entry = blacklist.check(guild)

    if (!entry) {
      void emitter.emit("blacklist.joinSuccess", guild)
      return
    }

    await guild.leave()

    void emitter.emit("blacklist.joinPrevented", entry)
    return
  })

const blacklistCheckCron = new BotCronBuilder()
  .setPattern("* * * * *")
  .setExecute(async (client) => {
    const guilds = client.guilds.cache.values()

    for (const guild of guilds) {
      const blacklist = client.blacklist
      const emitter = client.phase.emitter

      const entry = blacklist.check(guild)
      if (!entry) continue

      await guild.leave()

      void emitter.emit("blacklist.joinPrevented", entry)
    }
  })

function blacklistPlugin(options: BlacklistPluginOptions) {
  return new BotPlugin({
    name: "Blacklist",
    trigger: "ready",
    version: version,
    onLoad(phase) {
      // add blacklist to client
      phase.client.blacklist = new Blacklist(phase, [
        ...(options.entries ?? []),
        ...(options.populate?.(phase) ?? []),
      ])

      // add cron and event
      phase.crons.create(blacklistCheckCron.build(phase.client))
      phase.events.create(blacklistCheckEvent.build(phase.client) as BotEvent)
    },
  })
}

// exports

export * from "~/lib/utils"

export * from "~/structures/Blacklist"
export * from "~/structures/Entry"

export { blacklistPlugin, blacklistCheckCron, blacklistCheckEvent }

export type * from "~/types/declarations/client"
export type * from "~/types/declarations/events"
export type * from "~/types/plugin"
