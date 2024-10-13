// this currently uses audit logs' config, but it'll be moved to its own module in the future

import { ChannelType, EmbedBuilder } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import invitesTracker from "@androz2091/discord-invites-tracker"
import { ModuleId } from "@repo/utils/modules"

import { PhaseColour } from "~/lib/enums"
import { dateToTimestamp, wrapText } from "~/lib/utils"

export default new BotEventBuilder()
  .setName("ready")
  .setExecute(async (client) => {
    const inviteEvents = invitesTracker.init(client, {
      fetchGuilds: true,
      fetchVanity: true,
      fetchAuditLogs: true,
    })

    inviteEvents.on("guildMemberAdd", (member, _joinType, invite) => {
      if (member.user.bot) return

      const { guild } = member

      const guildDoc = client.stores.guilds.get(guild.id)
      if (!guildDoc) return

      const moduleConfig = guildDoc.modules?.[ModuleId.AuditLogs]
      if (!moduleConfig?.enabled) return

      const logsChannelId = moduleConfig.channels.invites
      if (!logsChannelId) return

      const logsChannel = client.channels.cache.get(logsChannelId)
      if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return

      if (!logsChannel.permissionsFor(guild.members.me!).has("SendMessages")) {
        return
      }

      try {
        void logsChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setAuthor({
                name: member.user.username,
                iconURL: member.displayAvatarURL(),
              })
              .setTitle("Invite Used")
              .setThumbnail(member.displayAvatarURL())
              .addFields(
                {
                  name: "Code",
                  value: wrapText(invite?.code ?? "unknown", "`"),
                  inline: true,
                },
                {
                  name: "Uses",
                  value: invite?.maxUses
                    ? `\`${invite.uses} / ${invite.maxUses}\``
                    : `\`${invite?.uses ?? "unknown"}\``,
                  inline: true,
                },
                {
                  name: "Created By",
                  value: invite?.inviter
                    ? `<@${invite.inviter.id}>`
                    : "unknown",
                  inline: true,
                },
                {
                  name: "Created At",
                  value: invite?.createdTimestamp
                    ? dateToTimestamp(
                        new Date(invite.createdTimestamp),
                        "longDate",
                      )
                    : "unknown",
                  inline: true,
                },
                {
                  name: "Expires At",
                  value: invite?.maxAge
                    ? dateToTimestamp(
                        new Date(Date.now() + invite.maxAge * 1000),
                        "longDate",
                      )
                    : "unknown",
                  inline: true,
                },
              )
              .setFooter({ text: `User ID: ${member.id}` })
              .setTimestamp(),
          ],
        })
      } catch (error) {
        console.error(
          `Failed to send invite tracker log entry to channel ${logsChannel.id} in guild ${guild.id}:`,
          error,
        )
      }
    })
  })
