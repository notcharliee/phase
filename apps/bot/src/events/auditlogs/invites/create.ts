import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"

import { GuildSchema } from "@repo/schemas"
import { PhaseColour } from "~/utils"
import { botEvent } from "phasebot"

export default botEvent("inviteCreate", async (client, invite) => {
  const guildSchema = await GuildSchema.findOne({ id: invite.guild?.id })
  if (!guildSchema) return

  if (
    !guildSchema.modules?.AuditLogs?.enabled ||
    !guildSchema.modules.AuditLogs.channels.invites ||
    !client.channels.cache.has(guildSchema.modules.AuditLogs.channels.invites)
  )
    return

  const logsChannel = client.channels.cache.get(
    guildSchema.modules.AuditLogs.channels.invites,
  ) as GuildTextBasedChannel

  const inviter = invite.inviter ?? "`Unknown`"
  const code = invite?.code ? `\`${invite.code}\`` : "`Unknown`"
  const expires = invite.expiresAt
    ? `<t:${Math.floor(invite.expiresAt.getTime() / 1000)}:R>`
    : "`N/A`"
  const maxUses = invite.maxUses ?? "N/A"
  const channel = invite.channel ?? "`N/A`"

  logsChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(PhaseColour.Primary)
        .setDescription(
          `**Inviter:** ${inviter}\n**Code:** \`${code}\`\n**Expires:** ${expires}\n**Max Uses:** \`${maxUses}\`\n**Channel:** ${channel}`,
        )
        .setTitle("Invite Created"),
    ],
  })
})
