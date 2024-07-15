import { GuildMember, PermissionFlagsBits } from "discord.js"
import { type BotCommandMiddleware } from "phasebot/builders"

import { GuildSchema } from "@repo/schemas"

import { errorMessage, missingPermission } from "~/utils"

export const commands: BotCommandMiddleware = async (interaction, execute) => {
  if (!interaction.guild) {
    try {
      return await execute(interaction)
    } catch (error) {
      return console.error(error)
    }
  }

  if (
    !interaction.guild.channels.cache
      .get(interaction.channelId)
      ?.permissionsFor(interaction.guild.members.me!)
      .has(PermissionFlagsBits.SendMessages)
  ) {
    interaction.reply(missingPermission(PermissionFlagsBits.SendMessages, true))
    return
  }

  const commandName = [
    interaction.commandName,
    interaction.options.getSubcommandGroup(false) ?? "",
    interaction.options.getSubcommand(false) ?? "",
  ]
    .join(" ")
    .trim()
    .replaceAll("  ", " ")

  const guild = await GuildSchema.findOne({ id: interaction.guild.id })
  const command = guild && guild.commands && guild.commands[commandName]

  if (command) {
    if (command.disabled) {
      return await interaction.reply(
        errorMessage({
          title: "Command Disabled",
          description: `This command has been disabled by the server administrators.`,
          ephemeral: true,
        }),
      )
    }

    const userId = `user:${interaction.user.id}`
    const userRoles = (interaction.member as GuildMember).roles.cache.map(
      (role) => `role:${role.id}`,
    )

    const isExplicitlyAllowed = command.allow.some((perm) => {
      if (perm.startsWith("role:")) return userRoles.includes(perm)
      if (perm.startsWith("user:")) return perm === userId
      return
    })

    if (isExplicitlyAllowed) {
      try {
        return await execute(interaction)
      } catch (error) {
        return console.error(error)
      }
    }

    const isExplicitlyDenied = command.deny.some((perm) => {
      if (perm.startsWith("role:")) return userRoles.includes(perm)
      if (perm.startsWith("user:")) return perm === userId
      return
    })

    if (isExplicitlyDenied) {
      return await interaction.reply(missingPermission())
    }
  }

  const defaultPermissions: { [key: string]: bigint | undefined } = {
    announce: PermissionFlagsBits.MentionEveryone,
    "giveaway create": PermissionFlagsBits.ManageGuild,
    "giveaway delete": PermissionFlagsBits.ManageGuild,
    "giveaway reroll": PermissionFlagsBits.ManageGuild,
    lock: PermissionFlagsBits.ModerateMembers,
    nuke: PermissionFlagsBits.ManageChannels,
    purge: PermissionFlagsBits.ManageMessages,
    "warn add": PermissionFlagsBits.ModerateMembers,
    "warn remove": PermissionFlagsBits.ModerateMembers,
    "level set": PermissionFlagsBits.ManageGuild,
    "tag add": PermissionFlagsBits.ManageMessages,
    "tag edit": PermissionFlagsBits.ManageMessages,
    "tag remove": PermissionFlagsBits.ManageMessages,
  }

  const defaultPerm = defaultPermissions[commandName]

  if (defaultPerm && !interaction.memberPermissions?.has(defaultPerm)) {
    return await interaction.reply(missingPermission(defaultPerm))
  }

  try {
    return await execute(interaction)
  } catch (error) {
    return console.error(error)
  }
}
