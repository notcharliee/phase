import { PermissionFlagsBits } from "discord.js"
import type { BotCommandMiddleware } from "phasebot"
import { missingPermission } from "~/utils"

const middleware: BotCommandMiddleware = async (client, interaction) => {
  const commandName = [
    interaction.commandName,
    interaction.options.getSubcommandGroup(false) ?? "",
    interaction.options.getSubcommand(false) ?? "",
  ]
    .join(" ")
    .trim()
    .replaceAll("  ", " ")

  const permCheck = async (perm: bigint) => {
    if (!interaction.memberPermissions?.has(perm)) {
      await interaction.reply(missingPermission(perm))
      return false
    }

    return true
  }

  switch (commandName) {
    case "announce":
      return await permCheck(PermissionFlagsBits.MentionEveryone)
    case "giveaway create":
      return await permCheck(PermissionFlagsBits.ManageGuild)
    case "giveaway delete":
      return await permCheck(PermissionFlagsBits.ManageGuild)
    case "giveaway reroll":
      return await permCheck(PermissionFlagsBits.ManageGuild)
    case "lock":
      return await permCheck(PermissionFlagsBits.ModerateMembers)
    case "nuke":
      return await permCheck(PermissionFlagsBits.ManageChannels)
    case "purge":
      return await permCheck(PermissionFlagsBits.ManageMessages)
    case "warn add":
      return await permCheck(PermissionFlagsBits.ModerateMembers)
    case "warn remove":
      return await permCheck(PermissionFlagsBits.ModerateMembers)
    case "level set":
      return await permCheck(PermissionFlagsBits.ManageGuild)
    case "tag add":
      return await permCheck(PermissionFlagsBits.ManageMessages)
    case "tag edit":
      return await permCheck(PermissionFlagsBits.ManageMessages)
    case "tag remove":
      return await permCheck(PermissionFlagsBits.ManageMessages)
    default: return true
  }
}

export default middleware
