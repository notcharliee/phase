import { ChannelType } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { db } from "~/lib/db"

export default new BotEventBuilder()
  .setName("voiceStateUpdate")
  .setExecute(async (_, oldVoice, newVoice) => {
    const guildDoc = await cache.guilds.get(oldVoice.guild.id)
    const joinToCreateModule = guildDoc?.modules?.[ModuleId.JoinToCreates]

    if (!guildDoc || !joinToCreateModule?.enabled) return

    if (
      oldVoice.channel &&
      "active" in joinToCreateModule &&
      joinToCreateModule.active.includes(oldVoice.channel.id) &&
      oldVoice.channel.members.filter((member) => !member.user.bot).size === 0
    ) {
      void oldVoice.channel.delete()

      const newActive = joinToCreateModule.active.filter(
        (activeChannelId) => activeChannelId !== oldVoice.channel!.id,
      )

      void db.guilds.updateOne(
        { id: oldVoice.guild.id },
        { $set: { [`modules.${ModuleId.JoinToCreates}.active`]: newActive } },
      )
    }

    if (newVoice.channelId === joinToCreateModule.channel) {
      const newVoiceChannel = await newVoice.guild.channels.create({
        name: newVoice.member?.user.username ?? "voice channel",
        type: ChannelType.GuildVoice,
        parent: joinToCreateModule.category,
      })

      void newVoice.setChannel(newVoiceChannel)

      const newActive = !("active" in joinToCreateModule)
        ? []
        : joinToCreateModule.active.concat(newVoiceChannel.id)

      void db.guilds.updateOne(
        { id: newVoice.guild.id },
        { $set: { [`modules.${ModuleId.JoinToCreates}.active`]: newActive } },
      )
    }
  })
