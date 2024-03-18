import { BotCommandBuilder, botCommand } from "phasebot"
import { PhaseColour, memberNotFound } from "~/utils"
import { GuildMember, PermissionResolvable, EmbedBuilder } from "discord.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("whois")
    .setDescription("Displays member data in an embed.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member you want to select.")
        .setRequired(true),
    ),
  async (client, interaction) => {
    const member = interaction.options.getMember("member") as GuildMember | null
    if (!member) return interaction.reply(memberNotFound())

    const keyPermissionsArray = [
      "Administrator",
      "ManageGuild",
      "ManageRoles",
      "ManageChannels",
      "ManageMessages",
      "ManageWebhooks",
      "ManageNicknames",
      "ManageEmojisAndStickers",
      "ManageEvents",
      "KickMembers",
      "BanMembers",
      "MentionEveryone",
      "MuteMembers",
      "DeafenMembers",
      "PrioritySpeaker",
      "MoveMembers",
      "ManageEvents",
      "ManageThreads",
      "ModerateMembers",
      "ViewCreatorMonetizationAnalytics",
      "ViewAuditLog",
    ]

    const memberPermissions = member.permissions.serialize(true)
    const permissionsArray = keyPermissionsArray.filter(
      (permission) =>
        memberPermissions[permission as keyof PermissionResolvable],
    )

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            iconURL: member.displayAvatarURL(),
            name: member.displayName,
          })
          .setColor(PhaseColour.Primary)
          .setDescription(`${member}`)
          .setFields([
            {
              inline: true,
              name: "Joined",
              value: member.joinedAt
                ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>`
                : "Unknown",
            },
            {
              inline: true,
              name: "Registered",
              value: `<t:${Math.floor(member.user.createdAt.getTime() / 1000)}:R>`,
            },
            {
              inline: false,
              name: `Roles [${member.roles.cache.size - 1}]`,
              value: member.roles.cache
                .sort((roleA, roleB) => {
                  return roleB.position - roleA.position
                })
                .map((role) => {
                  return `${role.name != "@everyone" ? role : ""}`
                })
                .toString()
                .replaceAll(",", " "),
            },
            {
              inline: false,
              name: `Key Permissions [${permissionsArray.length}]`,
              value: permissionsArray.length
                ? permissionsArray
                    .map((permission) => {
                      return permission.replace(/([a-z])([A-Z])/g, "$1 $2")
                    })
                    .toString()
                    .replaceAll(",", ", ")
                : "None",
            },
          ])
          .setFooter({
            text: `ID: ${member.id}`,
          })
          .setThumbnail(member.displayAvatarURL())
          .setTimestamp(),
      ],
    })
  },
)
