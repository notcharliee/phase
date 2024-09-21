import { GuildPremiumTier } from "discord.js"
import { BotCronBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"
import { moduleVariables } from "@repo/config/phase/variables.ts"

import type { Variable } from "@repo/config/phase/variables.ts"
import type { Client, Guild } from "discord.js"

export default new BotCronBuilder()
  .setPattern("*/10 * * * *")
  .setExecute(async (client) => {
    const guildDocs = client.store.guilds
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

          let newName = counter.content

          const variables = moduleVariables[ModuleId.Counters].filter(
            (variable) => newName.includes(`{${variable.name}}`),
          )

          for (const variable of variables) {
            newName = replaceVariable(newName, variable, guild)
          }

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

function replaceVariable(newName: string, variable: Variable, guild: Guild) {
  switch (variable.name) {
    case "ageInDays":
      return newName.replaceAll(
        `{${variable.name}}`,
        Math.floor(
          (Date.now() - guild.createdAt.getTime()) / (1000 * 60 * 60 * 24),
        ) + "",
      )

    case "boostCount":
      return newName.replaceAll(
        `{${variable.name}}`,
        guild.premiumSubscriptionCount + "",
      )

    case "boostTarget":
      return newName.replaceAll(
        `{${variable.name}}`,
        {
          [GuildPremiumTier.None]: "2",
          [GuildPremiumTier.Tier1]: "7",
          [GuildPremiumTier.Tier2]: "14",
          [GuildPremiumTier.Tier3]: "None",
        }[guild.premiumTier],
      )

    case "channelCount":
      return newName.replaceAll(
        `{${variable.name}}`,
        guild.channels.cache.size + "",
      )

    case "memberCount":
      return newName.replaceAll(`{${variable.name}}`, guild.memberCount + "")

    case "onlineMemberCount":
      return newName.replaceAll(
        `{${variable.name}}`,
        guild.approximatePresenceCount + "",
      )

    case "offlineMemberCount":
      return newName.replaceAll(
        `{${variable.name}}`,
        guild.memberCount - (guild.approximatePresenceCount ?? 0) + "",
      )

    case "roleCount":
      return newName.replaceAll(
        `{${variable.name}}`,
        guild.roles.cache.size + "",
      )

    default:
      return newName
  }
}

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
