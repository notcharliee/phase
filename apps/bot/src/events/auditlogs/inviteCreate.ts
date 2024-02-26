import { EmbedBuilder } from "discord.js"

import { GuildSchema } from "@repo/schemas"
import { PhaseColour } from "~/utils"
import { botEvent } from "phase.js"

export default botEvent("inviteCreate", async (client, invite) => {
  const guildSchema = await GuildSchema.findOne({ id: invite.guild?.id })
  if (!guildSchema) return

  if (
    !guildSchema.modules.AuditLogs.enabled ||
    !guildSchema.modules.AuditLogs.channels.invites ||
    !client.channels.cache.has(guildSchema.modules.AuditLogs.channels.invites)
  )
    return

  const channel = client.channels.cache.get(
    guildSchema.modules.AuditLogs.channels.invites,
  )!
  
  if (!channel.isTextBased()) return

  channel.send({
    embeds: [
      new EmbedBuilder()
        .setAuthor({
          iconURL: invite.inviter?.displayAvatarURL(),
          name: "Invite created.",
        })
        .setColor(PhaseColour.Primary)
        .setDescription(
          `Code: \`${invite.code}\`\nExpires: ${invite.expiresAt ? `<t:${invite.expiresAt.getSeconds()}:R>` : "`N/A`"}\nMax uses: ${invite.maxUses ?? "`N/A`"}\nChannel: ${invite.channel ?? "`N/A`"}\nURL: ${invite.url}`,
        )
        .setTitle("Audit Logs - Invites"),
    ],
  })
})
