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

    const channelsToDelete: Promise<void>[] = []
    const guildIdsToUpdate: string[] = []

    for (const guildDoc of guildDocsWithActiveJTCs.values()) {
      const activeJTCChannelIDs =
        guildDoc.modules![ModuleId.JoinToCreates]!.active

      const activeJTCChannels = client.channels.cache.filter(
        (channel): channel is VoiceChannel =>
          activeJTCChannelIDs.includes(channel.id),
      )

      for (const [, activeJTCChannel] of activeJTCChannels) {
        const activeJTCChannelMembers = activeJTCChannel.members.filter(
          (member) => !member.user.bot,
        )

        if (activeJTCChannelMembers.size === 0) {
          channelsToDelete.push(
            activeJTCChannel
              .delete()
              .then(() => {
                return
              })
              .catch((err) => {
                console.error(
                  `Failed to delete an active JTC channel ${activeJTCChannel.id}:`,
                  err,
                )
              }),
          )
        }
      }

      guildIdsToUpdate.push(guildDoc.id)
    }

    if (channelsToDelete.length > 0) {
      await Promise.all(channelsToDelete)
    }

    if (guildIdsToUpdate.length > 0) {
      await db.guilds.updateMany(
        { id: { $in: guildIdsToUpdate } },
        { $set: { [`modules.${ModuleId.JoinToCreates}.active`]: [] } },
      )
    }
  })
