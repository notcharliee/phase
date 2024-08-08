import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(!oldVoice.channel && newVoice.channel)) return

    const guildSchema = await db.guilds.findOne({ id: newVoice.guild.id })
    if (!guildSchema) return

    if (
      !guildSchema.modules?.[ModuleId.AuditLogs]?.enabled ||
      !guildSchema.modules[ModuleId.AuditLogs].channels.voice ||
      !client.channels.cache.has(
        guildSchema.modules[ModuleId.AuditLogs].channels.voice,
      )
    ) {
      return
    }

    const logsChannel = client.channels.cache.get(
      guildSchema.modules[ModuleId.AuditLogs].channels.voice,
    ) as GuildTextBasedChannel

    const member = newVoice.member!
    const channel = newVoice.channel!

    if (
      guildSchema.modules[ModuleId.JoinToCreates]?.enabled &&
      client.channels.cache.has(
        guildSchema.modules[ModuleId.JoinToCreates].channel,
      ) &&
      channel.id === guildSchema.modules[ModuleId.JoinToCreates].channel
    ) {
      return logsChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Join to Create Activated")
            .setThumbnail(member.displayAvatarURL())
            .setColor(PhaseColour.Primary)
            .setDescription(`Creating private voice channel for ${member}`),
        ],
      })
    }

    const users = channel.members.size
    const userLimit = channel.userLimit ? `/${channel.userLimit}` : ""

    return logsChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Member Joined Voice")
          .setThumbnail(member.displayAvatarURL())
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Channel:** ${channel}\n**Users:** ${users}${userLimit}`,
          ),
      ],
    })
  },
)
