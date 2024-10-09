import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"

export default new BotEventBuilder()
  .setName("voiceStateUpdate")
  .setExecute(async (client, oldVoice, newVoice) => {
    if (
      !oldVoice.channelId ||
      !oldVoice.member ||
      oldVoice.channelId === newVoice.channelId
    ) {
      return
    }

    const guildDoc = client.store.guilds.get(oldVoice.guild.id)
    const moduleConfig = guildDoc?.modules?.[ModuleId.JoinToCreates]

    if (!moduleConfig?.enabled) return

    const oldVoiceJTC = await db.joinToCreates.findOne({
      guild: oldVoice.guild.id,
      channel: oldVoice.channelId,
    })

    if (!oldVoiceJTC || oldVoiceJTC.owner !== oldVoice.member.id) return

    try {
      await oldVoice.guild.channels.delete(oldVoice.channelId)
    } catch {
      // do nothing
    }
  })
