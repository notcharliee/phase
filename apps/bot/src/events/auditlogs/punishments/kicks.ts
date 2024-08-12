import { AuditLogEvent, EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
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

  const guildDoc = await cache.guilds.get(member.guild.id)
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

  return void logsChannel
    .send({
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
    .catch(() => null)
})
