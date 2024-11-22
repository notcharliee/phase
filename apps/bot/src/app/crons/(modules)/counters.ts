import { BotCronBuilder } from "@phasejs/core/builders"

import { ModuleDefinitions, ModuleId } from "@repo/utils/modules"

export default new BotCronBuilder()
  .setPattern("*/10 * * * *")
  .setExecute(async (client) => {
    const guildDocs = client.stores.guilds
      .filter(
        (guildDoc) =>
          client.guilds.cache.has(guildDoc.id) &&
          guildDoc.modules?.[ModuleId.Counters]?.enabled,
      )
      .values()

    await Promise.all(
      Array.from(guildDocs).map(async (guildDoc) => {
        const guild = await client.guilds.fetch({
          guild: guildDoc.id,
          withCounts: true,
          force: true,
        })

        const moduleConfig = guildDoc.modules![ModuleId.Counters]!
        const moduleDefinintion = ModuleDefinitions[ModuleId.Counters]

        const counterPromises = moduleConfig.counters.map(async (counter) => {
          const channel = guild.channels.cache.get(counter.channel)
          if (!channel) return

          const newName = moduleDefinintion.variables.parse(
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
