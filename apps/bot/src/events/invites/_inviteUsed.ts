import { EmbedBuilder } from "discord.js"

import { client, inviteEvents } from "#src/main.js"

import { GuildSchema } from "@repo/schemas"
import { PhaseColour } from "#src/utils/index.js" 


inviteEvents.on("guildMemberAdd", async (member, joinType, invite) => {
  const guildSchema = await GuildSchema.findOne({ id: member.guild.id })
  if (!guildSchema) return

  if (
    !guildSchema.modules.AuditLogs.enabled ||
    !guildSchema.modules.AuditLogs.channels.invites ||
    !client.channels.cache.has(guildSchema.modules.AuditLogs.channels.invites)
  ) return

  const channel = client.channels.cache.get(guildSchema.modules.AuditLogs.channels.invites)!
  if (!channel.isTextBased()) return

  const inviter = invite?.inviter ?? "`Unknown`"
  
  const code = invite?.code
    ? `\`${invite.code}\``
    : "`Unknown`"

    const uses = joinType === "vanity"
      ? "`N/A`"
      : invite?.uses
        ? invite.maxUses
          ? `\`${invite.uses} / ${invite.maxUses}\``
          : `\`${invite.uses}\``
        : "`Unknown`"
  
  channel.send({
    embeds: [
      new EmbedBuilder()
      .setAuthor({ iconURL: member.displayAvatarURL(), name: `${member.displayName} joined.` })
      .setColor(PhaseColour.Primary)
      .setDescription(`New member: ${member}\nInvited by: ${inviter}\nUsing code: ${code}\nUses left: ${uses}`)
      .setFooter({ text: `ID: ${member.id}` })
      .setTitle("Audit Logs - Invites")
    ],
  })
})
