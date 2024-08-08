import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(!oldVoice.mute && newVoice.mute)) return

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
