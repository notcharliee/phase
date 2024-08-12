import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"

export default botEvent("inviteCreate", async (client, invite) => {
  const guildDoc = await cache.guilds.get(invite.guild!.id)
  if (!guildDoc) return

  if (
    !guildDoc.modules?.[ModuleId.AuditLogs]?.enabled ||
    !guildDoc.modules[ModuleId.AuditLogs].channels.invites ||
    !client.channels.cache.has(
      guildDoc.modules[ModuleId.AuditLogs].channels.invites,
    )
  )
    return

  const logsChannel = client.channels.cache.get(
    guildDoc.modules[ModuleId.AuditLogs].channels.invites,
  ) as GuildTextBasedChannel

  const inviter = invite.inviter ?? "`Unknown`"
  const code = invite?.code ? `\`${invite.code}\`` : "`Unknown`"
  const expires = invite.expiresAt
    ? `<t:${Math.floor(invite.expiresAt.getTime() / 1000)}:R>`
    : "`N/A`"
  const maxUses = invite.maxUses ?? "N/A"
  const channel = invite.channel ?? "`N/A`"

  void logsChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(PhaseColour.Primary)
        .setDescription(
          `**Inviter:** ${inviter}\n**Code:** \`${code}\`\n**Expires:** ${expires}\n**Max Uses:** \`${maxUses}\`\n**Channel:** ${channel}`,
        )
        .setTitle("Invite Created"),
    ],
  }).catch(() => null)
})
