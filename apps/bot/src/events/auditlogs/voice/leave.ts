import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(oldVoice.channel && !newVoice.channel)) return

    const guildSchema = await db.guilds.findOne({ id: newVoice.guild.id })
    if (!guildSchema) return

    if (
      !guildSchema.modules?.AuditLogs?.enabled ||
      !guildSchema.modules.AuditLogs.channels.voice ||
      !client.channels.cache.has(guildSchema.modules.AuditLogs.channels.voice)
    ) {
      return
    }

    const logsChannel = client.channels.cache.get(
      guildSchema.modules.AuditLogs.channels.voice,
    ) as GuildTextBasedChannel

    const member = oldVoice.member!
    const channel = oldVoice.channel!

    if (
      guildSchema.modules.JoinToCreates?.enabled &&
      client.channels.cache.has(guildSchema.modules.JoinToCreates.channel) &&
      channel.id === guildSchema.modules.JoinToCreates.channel
    ) {
      return
    }

    const users = channel.members.size
    const userLimit = channel.userLimit ? `/${channel.userLimit}` : ""

    return logsChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Member Left Voice")
          .setThumbnail(member.displayAvatarURL())
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Channel:** ${channel}\n**Users:** ${users}${userLimit}`,
          ),
      ],
    })
  },
)
