import { EmbedBuilder, PermissionFlagsBits } from "discord.js"
import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"

import { formatDate } from "./_utils"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("member")
  .setDescription("Gives you info about a member.")
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The member you want to select.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const member = interaction.options.getMember("member") as GuildMember | null

    if (!member) {
      void interaction.reply(BotErrorMessage.memberNotFound().toJSON())
      return
    }

    const elevatedPermissions = [
      PermissionFlagsBits.Administrator,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.ManageGuild,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageWebhooks,
      PermissionFlagsBits.ManageGuildExpressions,
      PermissionFlagsBits.ManageThreads,
      PermissionFlagsBits.ManageEvents,
      PermissionFlagsBits.ManageNicknames,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.MentionEveryone,
      PermissionFlagsBits.ViewAuditLog,
      PermissionFlagsBits.MuteMembers,
      PermissionFlagsBits.DeafenMembers,
      PermissionFlagsBits.MoveMembers,
      PermissionFlagsBits.PrioritySpeaker,
      PermissionFlagsBits.ViewGuildInsights,
      PermissionFlagsBits.ViewCreatorMonetizationAnalytics,
    ]
      .filter((permission) => member.permissions.has(permission))
      .map((permissionBigint) => {
        const permissionKey = Object.keys(PermissionFlagsBits).find(
          (key) =>
            PermissionFlagsBits[key as keyof typeof PermissionFlagsBits] ===
            permissionBigint,
        )!

        return permissionKey.replace(/([A-Z])/g, " $1").trim()
      })

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(
            member.roles.highest.hexColor !== "#000000"
              ? member.roles.highest.hexColor
              : PhaseColour.Primary,
          )
          .setThumbnail(member.displayAvatarURL())
          .setDescription(`<@${member.id}>`)
          .setFields([
            {
              name: "Username",
              value: member.user.username,
            },
            {
              name: "Joined",
              value: formatDate(member.joinedAt!),
              inline: true,
            },
            {
              name: "Registered",
              value: formatDate(member.user.createdAt),
              inline: true,
            },
            {
              name: `Roles [${member.roles.cache.size - 1}]`,
              value: member.roles.cache
                .filter((role) => role.name !== "@everyone")
                .sort((roleA, roleB) => roleB.position - roleA.position)
                .toJSON()
                .join(", "),
            },
            {
              name: `Elevated Permissions [${elevatedPermissions.length}]`,
              value: elevatedPermissions.length
                ? `${elevatedPermissions.join(", ")}`
                : "None",
            },
          ])
          .setFooter({ text: `ID: ${member.id}` })
          .setTimestamp(),
      ],
    })
  })
