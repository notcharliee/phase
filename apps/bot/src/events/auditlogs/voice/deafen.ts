import { botEvent } from "phasebot"
import { GuildSchema } from "@repo/schemas"
import { PhaseColour } from "~/utils"

import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(!oldVoice.deaf && newVoice.deaf)) return

    const guildSchema = await GuildSchema.findOne({ id: newVoice.guild.id })
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
          .setTitle("Member Deafened")
          .setThumbnail(member.displayAvatarURL())
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Status:** \`Deafened\`\n**Deafened Self:** ${newVoice.selfDeaf ? "`true`" : "`false`"}\n**Server Deafened:** ${newVoice.serverDeaf ? "`true`" : "`false`"}`,
          ),
      ],
    })
  },
)
