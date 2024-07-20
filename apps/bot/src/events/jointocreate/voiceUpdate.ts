import { ChannelType } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { db } from "~/lib/db"

import type { GuildModules } from "~/lib/db"

export default new BotEventBuilder()
  .setName("voiceStateUpdate")
  .setExecute(async (_, oldVoice, newVoice) => {
    const guildSchema = await db.guilds.findOne({ id: oldVoice.guild.id })
    const joinToCreateModule = guildSchema?.modules?.JoinToCreates

    if (!guildSchema || !joinToCreateModule?.enabled) return

    if (
      oldVoice.channel &&
      "active" in joinToCreateModule &&
      joinToCreateModule.active.includes(oldVoice.channel.id) &&
      oldVoice.channel.members.filter((member) => !member.user.bot).size === 0
    ) {
      oldVoice.channel.delete()

      joinToCreateModule.active.splice(
        joinToCreateModule.active.indexOf(oldVoice.channel.id),
        1,
      )

      guildSchema.markModified("modules")
      guildSchema.save()
    }

    if (newVoice.channelId === joinToCreateModule.channel) {
      const newVoiceChannel = await newVoice.guild.channels.create({
        name: newVoice.member?.user.username ?? "voice channel",
        type: ChannelType.GuildVoice,
        parent: joinToCreateModule.category,
      })

      newVoice.setChannel(newVoiceChannel)

      if (!("active" in joinToCreateModule)) {
        ;(joinToCreateModule as GuildModules["JoinToCreates"]).active = []
      }

      joinToCreateModule.active.push(newVoiceChannel.id)

      guildSchema.markModified("modules")
      guildSchema.save()
    }
  })
