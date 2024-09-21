import { ChannelType } from "discord.js"
import { BotCronBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"

import type { VoiceChannel } from "discord.js"

export default new BotCronBuilder()
  .setPattern("*/5 * * * * *") // every 5 seconds
  .setExecute(async (client) => {
    const guildDocsWithActiveJTCs = client.store.guilds.filter(
      (guildDoc) => guildDoc.modules?.[ModuleId.JoinToCreates]?.active.length,
    )

    const guildsToUpdate: { id: string; channels: VoiceChannel[] }[] = []

    for (const [guildId, guildDoc] of guildDocsWithActiveJTCs) {
      const activeJTCChannelIDs =
        guildDoc.modules![ModuleId.JoinToCreates]!.active

      const emptyJTCChannels = client.channels.cache.filter(
        (channel): channel is VoiceChannel =>
          activeJTCChannelIDs.includes(channel.id) &&
          channel.type === ChannelType.GuildVoice &&
          channel.members.size === 0,
      )

      guildsToUpdate.push({
        id: guildId,
        channels: emptyJTCChannels.toJSON(),
      })
    }

    if (guildsToUpdate.length > 0) {
      const guildIdsToUpdate: string[] = []

      for (const { id, channels } of guildsToUpdate) {
        guildIdsToUpdate.push(id)

        await Promise.all(
          channels.map(async (channel) => {
            try {
              return await channel.delete()
            } catch (error) {
              console.error(
                `Failed to delete an active JTC channel ${channel.id} in guild ${id}:`,
                error,
              )
            }
          }),
        )
      }

      await db.guilds.updateMany(
        { id: { $in: guildIdsToUpdate } },
        { $set: { [`modules.${ModuleId.JoinToCreates}.active`]: [] } },
      )
    }
  })
