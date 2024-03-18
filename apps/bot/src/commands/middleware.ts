import { PermissionFlagsBits } from "discord.js"
import type { BotCommandMiddleware } from "phasebot"
import { missingPermission } from "~/utils"

const middleware: BotCommandMiddleware = async (_, interaction) => {
  const commandName = [
    interaction.commandName,
    interaction.options.getSubcommandGroup(false) ?? "",
    interaction.options.getSubcommand(false) ?? "",
  ]
    .join(" ")
    .trim()
    .replaceAll("  ", " ")

  const commands: { [key: string]: bigint | undefined } = {
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

  const permCheck = async (perm: bigint | undefined) => {
    if (perm && !interaction.memberPermissions?.has(perm)) {
      await interaction.reply(missingPermission(perm))
      return false
    }

    return true
  }

  return await permCheck(commands[commandName])
}

export default middleware
