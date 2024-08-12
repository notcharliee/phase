import { GuildMember, PermissionFlagsBits } from "discord.js"
import { type BotCommandMiddleware } from "phasebot/builders"

import { cache } from "~/lib/cache"

import { BotError } from "./lib/errors"

export const commands: BotCommandMiddleware = async (
  interaction,
  execute,
  metadata,
) => {
  if (!interaction.guild) {
    if ("dmPermission" in metadata && metadata.dmPermission === false) {
      void interaction.reply(BotError.serverOnlyCommand().toJSON())
      return
    }

    try {
      return await execute(interaction)
    } catch (error) {
      return console.error(error)
    }
  }

  if (
    !interaction.guild.channels.cache
      .get(interaction.channelId)!
      .permissionsFor(interaction.guild.members.me!)
      .has(PermissionFlagsBits.SendMessages)
  ) {
    void interaction.reply(
      BotError.botMissingPermission("SendMessages", true).toJSON(),
    )

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

  const guild = await cache.guilds.get(interaction.guild.id)
  const command = guild && guild.commands && guild.commands[commandName]

  if (command) {
    if (command.disabled) {
      void interaction.reply(
        new BotError(
          "This command has been disabled by the server admins.",
        ).toJSON(),
      )

      return
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
      return await interaction.reply(BotError.userMissingPermission().toJSON())
    }
  }

  const defaultPermissions: { [key: string]: bigint | undefined } = {
    "giveaway create": PermissionFlagsBits.ManageGuild,
    "giveaway delete": PermissionFlagsBits.ManageGuild,
    "giveaway reroll": PermissionFlagsBits.ManageGuild,
    "warn add": PermissionFlagsBits.ModerateMembers,
    "warn remove": PermissionFlagsBits.ModerateMembers,
    announce: PermissionFlagsBits.MentionEveryone,
    lock: PermissionFlagsBits.ModerateMembers,
    scrub: PermissionFlagsBits.ManageChannels,
    purge: PermissionFlagsBits.ManageMessages,
    "level set": PermissionFlagsBits.ManageGuild,
    "tag create": PermissionFlagsBits.ManageMessages,
    "tag delete": PermissionFlagsBits.ManageMessages,
    "tag edit": PermissionFlagsBits.ManageMessages,
  }

  const defaultPerm = defaultPermissions[commandName]

  if (defaultPerm && !interaction.memberPermissions?.has(defaultPerm)) {
    return await interaction.reply(BotError.userMissingPermission().toJSON())
  }

  try {
    return await execute(interaction)
  } catch (error) {
    return console.error(error)
  }
}
