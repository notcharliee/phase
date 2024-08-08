import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(!oldVoice.deaf && newVoice.deaf)) return

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
