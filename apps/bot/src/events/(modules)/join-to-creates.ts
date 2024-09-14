import { ChannelType } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"

export default new BotEventBuilder()
  .setName("voiceStateUpdate")
  .setExecute(async (client, oldVoice, newVoice) => {
    if (!newVoice.channelId) return

    const guildDoc = client.store.guilds.get(oldVoice.guild.id)
    const joinToCreateModule = guildDoc?.modules?.[ModuleId.JoinToCreates]

    if (
      !guildDoc ||
      !joinToCreateModule?.enabled ||
      newVoice.channelId !== joinToCreateModule.channel
    ) {
      return
    }

    const newVoiceChannel = await newVoice.guild.channels
      .create({
        name: newVoice.member?.user.username ?? "voice channel",
        type: ChannelType.GuildVoice,
        parent: joinToCreateModule.category,
      })
      .catch((err) => {
        console.error(
          `Failed to create a new JTC channel in guild ${newVoice.guild.id}:`,
          err,
        )
      })

    if (newVoiceChannel) {
      void (await db.guilds.updateOne(
        { id: newVoice.guild.id },
        {
          $push: {
            [`modules.${ModuleId.JoinToCreates}.active`]: newVoiceChannel.id,
          },
        },
      ))

      await newVoice.setChannel(newVoiceChannel).catch((err) => {
        console.error(
          `Failed to move a member into a new JTC channel in guild ${newVoice.guild.id}:`,
          err,
        )
      })
    }
  })
