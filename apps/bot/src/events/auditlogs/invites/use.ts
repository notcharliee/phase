import { EmbedBuilder } from "discord.js"
import { botEvent } from "phasebot"

import invitesTracker from "@androz2091/discord-invites-tracker"
import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"

export default botEvent("ready", async (client) => {
  const inviteEvents = invitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true,
  })

  inviteEvents.on("guildMemberAdd", async (member, joinType, invite) => {
    const guildDoc = await cache.guilds.get(member.guild.id)
    if (!guildDoc) return

    if (
      !guildDoc.modules?.[ModuleId.AuditLogs]?.enabled ||
      !guildDoc.modules[ModuleId.AuditLogs].channels.invites ||
      !client.channels.cache.has(
        guildDoc.modules[ModuleId.AuditLogs].channels.invites,
      )
    )
      return

    const channel = client.channels.cache.get(
      guildDoc.modules[ModuleId.AuditLogs].channels.invites,
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
