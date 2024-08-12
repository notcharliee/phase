import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(!oldVoice.channel && newVoice.channel)) return

    const guildDoc = await cache.guilds.get(newVoice.guild.id)
    if (!guildDoc) return

    if (
      !guildDoc.modules?.[ModuleId.AuditLogs]?.enabled ||
      !guildDoc.modules[ModuleId.AuditLogs].channels.voice ||
      !client.channels.cache.has(
        guildDoc.modules[ModuleId.AuditLogs].channels.voice,
      )
    ) {
      return
    }

    const logsChannel = client.channels.cache.get(
      guildDoc.modules[ModuleId.AuditLogs].channels.voice,
    ) as GuildTextBasedChannel

    const member = newVoice.member!
    const channel = newVoice.channel!

    if (
      guildDoc.modules[ModuleId.JoinToCreates]?.enabled &&
      client.channels.cache.has(
        guildDoc.modules[ModuleId.JoinToCreates].channel,
      ) &&
      channel.id === guildDoc.modules[ModuleId.JoinToCreates].channel
    ) {
      return void logsChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Join to Create Activated")
            .setThumbnail(member.displayAvatarURL())
            .setColor(PhaseColour.Primary)
            .setDescription(`Creating private voice channel for ${member}`),
        ],
      }).catch(() => null)
    }

    const users = channel.members.size
    const userLimit = channel.userLimit ? `/${channel.userLimit}` : ""

    return void logsChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Member Joined Voice")
          .setThumbnail(member.displayAvatarURL())
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Channel:** ${channel}\n**Users:** ${users}${userLimit}`,
          ),
      ],
    }).catch(() => null)
  },
)
