import { AuditLogEvent, EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent("guildMemberRemove", async (client, member) => {
  const event = await member.guild
    .fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 })
    .then((auditLogs) => {
      const entry = auditLogs.entries.first()

      if (
        entry?.target?.id === member.id &&
        entry.createdAt > new Date(Date.now() - 5_000)
      ) {
        return entry
      }

      return null
    })
    .catch(() => null)

  if (!event) return

  const guildSchema = await db.guilds.findOne({ id: member.guild.id })
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

  return logsChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle("Member Kicked")
        .setThumbnail(member.displayAvatarURL())
        .setColor(PhaseColour.Primary)
        .setDescription(
          `**Offender:** ${member}\n**Reason:** ${event.reason ?? "No reason provided"}\n**Responsible Moderator:** ${event.executor?.username ?? "Unknown"}`,
        )
        .setFooter({
          text: `ID: ${member.id}`,
        })
        .setTimestamp(),
    ],
  })
})
