import { AuditLogEvent, EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent("guildBanAdd", async (client, ban) => {
  const guildSchema = await db.guilds.findOne({ id: ban.guild.id })
  if (!guildSchema) return

  if (
    !guildSchema.modules?.AuditLogs?.enabled ||
    !guildSchema.modules.AuditLogs.channels.punishments ||
    !client.channels.cache.has(
      guildSchema.modules.AuditLogs.channels.punishments,
    )
  ) {
    return
  }

  const logsChannel = client.channels.cache.get(
    guildSchema.modules.AuditLogs.channels.punishments,
  ) as GuildTextBasedChannel

  const member = ban.user

  const responsibleModerator = await ban.guild
    .fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 })
    .then((auditLogs) => auditLogs.entries.first()?.executor)
    .catch(() => null)

  return logsChannel.send({
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
})
