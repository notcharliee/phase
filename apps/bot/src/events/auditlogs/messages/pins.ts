import { AuditLogEvent, EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent("channelPinsUpdate", async (client, channel) => {
  if (channel.isDMBased()) return

  const guildSchema = await db.guilds.findOne({ id: channel.guild.id })
  if (!guildSchema) return

  if (
    !guildSchema.modules?.[ModuleId.AuditLogs]?.enabled ||
    !guildSchema.modules[ModuleId.AuditLogs].channels.messages ||
    !client.channels.cache.has(
      guildSchema.modules[ModuleId.AuditLogs].channels.messages,
    )
  ) {
    return
  }

  const logsChannel = client.channels.cache.get(
    guildSchema.modules[ModuleId.AuditLogs].channels.messages,
  ) as GuildTextBasedChannel

  const pinEvent = await channel.guild
    .fetchAuditLogs({ type: AuditLogEvent.MessagePin, limit: 1 })
    .then((auditLogs) => {
      const entry = auditLogs.entries.first()

      if (
        entry &&
        entry.extra.channel.id === channel.id &&
        entry.createdAt > new Date(Date.now() - 5_000)
      ) {
        return entry
      }

      return null
    })
    .catch(() => null)

  const unpinEvent = await channel.guild
    .fetchAuditLogs({ type: AuditLogEvent.MessageUnpin, limit: 1 })
    .then((auditLogs) => {
      const entry = auditLogs.entries.first()

      if (
        entry &&
        entry.extra.channel.id === channel.id &&
        entry.createdAt > new Date(Date.now() - 5_000)
      ) {
        return entry
      }

      return null
    })
    .catch(() => null)

  if (pinEvent && !unpinEvent) {
    const member = pinEvent.target
    const message = channel.messages.cache.get(pinEvent.extra.messageId)

    if (!message) return

    return logsChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message Pinned")
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Message:** [Click here to view](${message.url})`,
          )
          .setTimestamp(),
      ],
    })
  }

  if (unpinEvent && !pinEvent) {
    const member = unpinEvent.target
    const message = channel.messages.cache.get(unpinEvent.extra.messageId)

    if (!message) return

    return logsChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message Unpinned")
          .setColor(PhaseColour.Primary)
          .setDescription(
            `**Member:** ${member}\n**Message:** [Click here to view](${message.url})`,
          )
          .setTimestamp(),
      ],
    })
  }

  return
})
