import { BotEventBuilder } from "@phasejs/builders"

import { ModuleId } from "@repo/utils/modules"

import { dateToTimestamp, wrapText } from "~/lib/utils/formatting"
import { isSendableChannel } from "~/lib/utils/guards"

import { MessageBuilder } from "~/structures/builders"
import { getUsedInvite, hasRequiredGuildPermissions, mapInvite } from "./_utils"

export default new BotEventBuilder()
  .setName("guildMemberAdd")
  .setExecute(async (client, member) => {
    const guild = member.guild
    if (!hasRequiredGuildPermissions(guild)) return

    const inviteStore = client.stores.invites.get(guild.id)
    if (!inviteStore) return

    // compare the old invites with the new invites to see which invite was used

    const storedInvites = inviteStore
    const currentInvites = await guild.invites.fetch()

    const usedInvite = getUsedInvite(
      storedInvites,
      currentInvites.mapValues(mapInvite),
    )

    // update the invite store with the new invite collection

    client.stores.invites.set(guild.id, currentInvites.mapValues(mapInvite))

    // get the guild information

    const guildDoc = client.stores.guilds.get(guild.id)!

    const moduleConfig = guildDoc.modules?.[ModuleId.AuditLogs]
    if (!moduleConfig?.enabled || !moduleConfig.channels.invites) return

    const logsChannelId = moduleConfig.channels.invites
    const logsChannel = guild.channels.cache.get(logsChannelId)

    if (!logsChannel || !isSendableChannel(logsChannel)) return

    // send the invite tracker message

    try {
      await logsChannel.send(
        new MessageBuilder().setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setAuthor({
              name: member.user.username,
              iconURL: member.displayAvatarURL(),
            })
            .setTitle("Invite Used")
            .setThumbnail(member.displayAvatarURL())
            .setFields(
              {
                name: "Code",
                value: wrapText(usedInvite?.code ?? "unknown", "`"),
                inline: true,
              },
              {
                name: "Uses",
                value: usedInvite?.maxUses
                  ? `\`${usedInvite.uses} / ${usedInvite.maxUses}\``
                  : `\`${usedInvite?.uses ?? "unknown"}\``,
                inline: true,
              },
              {
                name: "Created By",
                value: usedInvite?.inviterId
                  ? `<@${usedInvite.inviterId}>`
                  : "unknown",
                inline: true,
              },
              {
                name: "Created At",
                value: usedInvite?.createdTimestamp
                  ? dateToTimestamp(
                      new Date(usedInvite.createdTimestamp),
                      "longDate",
                    )
                  : "unknown",
                inline: true,
              },
              {
                name: "Expires At",
                value: usedInvite?.maxAge
                  ? dateToTimestamp(
                      new Date(Date.now() + usedInvite.maxAge * 1000),
                      "longDate",
                    )
                  : "unknown",
                inline: true,
              },
            )
            .setFooter({ text: `User ID: ${member.id}` })
            .setTimestamp()
        }),
      )
    } catch (error) {
      console.error(
        `Failed to send audit log entry to channel ${logsChannelId} in guild ${guild.id}:`,
      )
      console.error(error)
    }
  })
