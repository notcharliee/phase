import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(oldVoice.deaf && !newVoice.deaf)) return

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

    return logsChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Member Undeafened")
          .setThumbnail(member.displayAvatarURL())
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Status:** \`Not Deafened\`\n**Self Deafened:** ${oldVoice.deaf ? "`true`" : "`false`"}\n**Server Deafened:** ${oldVoice.serverDeaf ? "`true`" : "`false`"}`,
          ),
      ],
    })
  },
)
