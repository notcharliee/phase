import { botEvent } from "phase.js"
import { GuildSchema } from "@repo/schemas"
import { PhaseColour } from "~/utils"

import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(!oldVoice.mute && newVoice.mute)) return

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
          .setTitle("Member Muted")
          .setThumbnail(member.displayAvatarURL())
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Status:** \`Muted\`\n**Muted Self:** ${newVoice.selfMute ? "`true`" : "`false`"}\n**Server Muted:** ${newVoice.serverMute ? "`true`" : "`false`"}`,
          ),
      ],
    })
  },
)
