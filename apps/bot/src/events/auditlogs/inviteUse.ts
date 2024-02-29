import { botEvent } from "phase.js"
import { GuildSchema } from "@repo/schemas"
import { PhaseColour } from "~/utils"
import { EmbedBuilder } from "discord.js"
import invitesTracker from "@androz2091/discord-invites-tracker"

export default botEvent("ready", async (client) => {
  const inviteEvents = invitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true,
  })

  inviteEvents.on("guildMemberAdd", async (member, joinType, invite) => {
    const guildSchema = await GuildSchema.findOne({ id: member.guild.id })
    if (!guildSchema) return

    if (
      !guildSchema.modules?.AuditLogs?.enabled ||
      !guildSchema.modules.AuditLogs.channels.invites ||
      !client.channels.cache.has(guildSchema.modules.AuditLogs.channels.invites)
    )
      return

    const channel = client.channels.cache.get(
      guildSchema.modules.AuditLogs.channels.invites,
    )!
    if (!channel.isTextBased()) return

    const inviter = invite?.inviter ?? "`Unknown`"

    const code = invite?.code ? `\`${invite.code}\`` : "`Unknown`"

    const uses =
      joinType === "vanity"
        ? "`N/A`"
        : invite?.uses
          ? invite.maxUses
            ? `\`${invite.uses} / ${invite.maxUses}\``
            : `\`${invite.uses}\``
          : "`Unknown`"

    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Invite Used")
          .setDescription(
            `**Member:** ${member}\n**Inviter:** ${inviter}\n**Code:** ${code}\n**Uses:** \`${uses}\``,
          )
          .setFooter({
            text: `${member.id}`,
            iconURL: member.displayAvatarURL(),
          }),
      ],
    })
  })
})
