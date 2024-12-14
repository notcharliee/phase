import { BotEventBuilder } from "@phasejs/core/builders"
import { ChannelType } from "discord.js"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"

/**
 * Cleans up JTC documents when their channels are deleted.
 */
export default new BotEventBuilder()
  .setName("channelDelete")
  .setExecute(async (client, channel) => {
    if (channel.isDMBased()) return

    const guildDoc = client.stores.guilds.get(channel.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.JoinToCreates]

    if (!moduleConfig?.enabled) return

    const isCategory = channel.type === ChannelType.GuildCategory
    const isVoice = channel.type === ChannelType.GuildVoice

    if (
      (!isCategory && !isVoice) ||
      (isCategory && channel.id !== moduleConfig.category) ||
      (isVoice && channel.parentId !== moduleConfig.category)
    ) {
      return
    }

    try {
      await db.joinToCreates.deleteOne({
        guild: channel.guildId,
        channel: channel.id,
      })
    } catch {
      // do nothing
    }
  })
