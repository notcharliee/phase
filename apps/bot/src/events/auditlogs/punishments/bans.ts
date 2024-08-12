import { AuditLogEvent, EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"

export default botEvent("guildBanAdd", async (client, ban) => {
  const guildDoc = await cache.guilds.get(ban.guild.id)
  if (!guildDoc) return

  if (
    !guildDoc.modules?.[ModuleId.AuditLogs]?.enabled ||
    !guildDoc.modules[ModuleId.AuditLogs].channels.punishments ||
    !client.channels.cache.has(
      guildDoc.modules[ModuleId.AuditLogs].channels.punishments,
    )
  ) {
    return
  }

  const logsChannel = client.channels.cache.get(
    guildDoc.modules[ModuleId.AuditLogs].channels.punishments,
  ) as GuildTextBasedChannel

  const member = ban.user

  const responsibleModerator = await ban.guild
    .fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 })
    .then((auditLogs) => auditLogs.entries.first()?.executor)
    .catch(() => null)

  return void logsChannel
    .send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Member Banned")
          .setThumbnail(member.displayAvatarURL())
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Offender:** ${member}\n**Reason:** ${ban.reason ?? "No reason provided"}\n**Responsible Moderator:** ${responsibleModerator?.username ?? "Unknown"}`,
          )
          .setFooter({
            text: `ID: ${member.id}`,
          })
          .setTimestamp(),
      ],
    })
    .catch(() => null)
})
