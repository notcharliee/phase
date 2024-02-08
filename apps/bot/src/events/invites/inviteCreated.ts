import { EmbedBuilder } from "discord.js"

import { GuildSchema } from "@repo/schemas"
import { clientEvent, formatDate, PhaseColour } from "#src/utils/index.js" 


export default clientEvent({
  name: "inviteCreate",
  async execute(client, invite) {
    const guildSchema = await GuildSchema.findOne({ id: invite.guild?.id })
    if (!guildSchema) return
  
    if (
      !guildSchema.modules.AuditLogs.enabled ||
      !guildSchema.modules.AuditLogs.channels.invites ||
      !client.channels.cache.has(guildSchema.modules.AuditLogs.channels.invites)
    ) return
  
    const channel = client.channels.cache.get(guildSchema.modules.AuditLogs.channels.invites)!
    if (!channel.isTextBased()) return
    
    channel.send({
      embeds: [
        new EmbedBuilder()
        .setAuthor({ iconURL: invite.inviter?.displayAvatarURL(), name: "Invite created." })
        .setColor(PhaseColour.Primary)
        .setDescription(`Code: \`${invite.code}\`\nExpires: ${invite.expiresAt ? formatDate(invite.expiresAt) : "`N/A`"}\nMax uses: ${invite.maxUses ?? "`N/A`"}\nChannel: ${invite.channel ?? "`N/A`"}\nURL: ${invite.url}`)
        .setTitle("Audit Logs - Invites")
      ],
    })
  }
})