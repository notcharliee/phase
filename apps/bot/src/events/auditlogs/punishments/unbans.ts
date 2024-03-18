import { botEvent } from "phasebot"
import { GuildSchema } from "@repo/schemas"
import { PhaseColour } from "~/utils"

import { AuditLogEvent, EmbedBuilder, GuildTextBasedChannel } from "discord.js"

export default botEvent("guildBanRemove", async (client, unban) => {
  const guildSchema = await GuildSchema.findOne({ id: unban.guild.id })
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

  const member = unban.user

  const responsibleModerator = await unban.guild
    .fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 })
    .then((auditLogs) => auditLogs.entries.first()?.executor)
    .catch(() => null)

  return logsChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle("Member Unbanned")
        .setThumbnail(member.displayAvatarURL())
        .setColor(PhaseColour.Primary)
        .setDescription(
          `**Offender:** ${member}\n**Ban Reason:** ${unban.reason ?? "No reason provided"}\n**Responsible Moderator:** ${responsibleModerator?.username ?? "Unknown"}`,
        )
        .setFooter({
          text: `ID: ${member.id}`,
        })
        .setTimestamp(),
    ],
  })
})
