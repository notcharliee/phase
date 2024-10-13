import { BotCronBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"
import { variables } from "@repo/utils/variables"

import type { Client } from "discord.js"

export default new BotCronBuilder()
  .setPattern("*/10 * * * *")
  .setExecute(async (client) => {
    const guildDocs = client.stores.guilds
      .filter((guildDoc) => guildDoc.modules?.[ModuleId.Counters]?.enabled)
      .values()

    await Promise.all(
      Array.from(guildDocs).map(async (guildDoc) => {
        const guild = await fetchGuildWithCounts(client, guildDoc.id)
        if (!guild) return

        const moduleConfig = guildDoc.modules![ModuleId.Counters]!

        const counterPromises = moduleConfig.counters.map(async (counter) => {
          const channel = guild.channels.cache.get(counter.channel)
          if (!channel) return

          const newName = variables.modules[ModuleId.Counters].parse(
            counter.content,
            guild,
          )

          if (newName === channel.name) return

          try {
            await channel.edit({ name: newName })
          } catch (error) {
            console.error(
              `Failed to edit counter channel ${channel.id} in guild ${guild.id}:`,
              error,
            )
          }
        })

        await Promise.all(counterPromises)
      }),
    )
  })

async function fetchGuildWithCounts(client: Client, guildId: string) {
  let guild = client.guilds.cache.get(guildId)

  if (!guild) return null

  if (!guild.approximateMemberCount) {
    try {
      guild = await client.guilds.fetch({
        guild: guildId,
        cache: true,
        withCounts: true,
      })
    } catch {
      return null
    }
  }

  return guild
}
