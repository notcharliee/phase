import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"

export default botEvent(
  "voiceStateUpdate",
  async (client, oldVoice, newVoice) => {
    if (!(oldVoice.mute && !newVoice.mute)) return

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

    const member = oldVoice.member!

    return void logsChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Member Unmuted")
            .setThumbnail(member.displayAvatarURL())
            .setColor(PhaseColour.Primary)
            .setDescription(
              `**Member:** ${member}\n**Status:** \`Not Muted\`\n**Self Muted:** ${oldVoice.selfMute ? "`true`" : "`false`"}\n**Server Muted:** ${oldVoice.serverMute ? "`true`" : "`false`"}`,
            ),
        ],
      })
      .catch(() => null)
  },
)
