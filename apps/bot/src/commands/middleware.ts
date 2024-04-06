import { GuildSchema } from "@repo/schemas"
import { GuildMember, PermissionFlagsBits } from "discord.js"
import { type BotCommandExecuteFunction } from "phasebot/builders"
import { errorMessage, missingPermission } from "~/utils"

const middleware: BotCommandExecuteFunction  = async (_, interaction) => {
  if (!interaction.guild) return true

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
      await interaction.reply(
        errorMessage({
          title: "Command Disabled",
          description: `This command has been disabled by the server administrators.`,
          ephemeral: true,
        }),
      )

      return false
    }

    const userId = `user:${interaction.user.id}`
    const userRoles = (interaction.member as GuildMember).roles.cache.map(
      (role) => `role:${role.id}`,
    )

    const isExplicitlyAllowed = command.allow.some((perm) => {
      if (perm.startsWith("role:")) return userRoles.includes(perm)
      if (perm.startsWith("user:")) return perm === userId
      return false
    })

    if (isExplicitlyAllowed) return true

    const isExplicitlyDenied = command.deny.some((perm) => {
      if (perm.startsWith("role:")) return userRoles.includes(perm)
      if (perm.startsWith("user:")) return perm === userId
      return false
    })

    if (isExplicitlyDenied) {
      await interaction.reply(missingPermission())
      return false
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
    await interaction.reply(missingPermission(defaultPerm))
    return false
  }

  return true
}

export default middleware
