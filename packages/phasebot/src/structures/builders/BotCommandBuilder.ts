import {
  ApplicationCommandType,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js"

import { Mixin } from "ts-mixer"

import { CommandManager } from "~/managers"
import { BotCommandExecute } from "~/types/commands"

import type {
  APIApplicationCommandSubcommandOption,
  ChannelType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SharedNameAndDescription,
  SharedSlashCommand,
  SharedSlashCommandOptions,
  SharedSlashCommandSubcommands,
} from "discord.js"

declare module "discord.js" {
  /**
   * The allowed channel types used for a channel option in a slash command builder.
   *
   * @privateRemarks This can't be dynamic because const enums are erased at runtime.
   * @internal
   */
  const allowedChannelTypes: readonly [
    ChannelType.GuildText,
    ChannelType.GuildVoice,
    ChannelType.GuildCategory,
    ChannelType.GuildAnnouncement,
    ChannelType.AnnouncementThread,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.GuildStageVoice,
    ChannelType.GuildForum,
    ChannelType.GuildMedia,
  ]

  /**
   * An interface specifically for slash command subcommands.
   */
  interface SlashCommandSubcommandsOnlyBuilder
    extends SharedNameAndDescription,
      SharedSlashCommandSubcommands<SlashCommandSubcommandsOnlyBuilder>,
      SharedSlashCommand,
      BotCommandBuilderBase {}

  /**
   * An interface specifically for slash command options.
   */
  interface SlashCommandOptionsOnlyBuilder
    extends SharedNameAndDescription,
      SharedSlashCommandOptions<SlashCommandOptionsOnlyBuilder>,
      SharedSlashCommand,
      BotCommandBuilderBase {}

  /**
   * A builder that creates API-compatible JSON data for slash commands.
   */
  interface SlashCommandBuilder
    extends SharedNameAndDescription,
      SharedSlashCommandOptions<SlashCommandOptionsOnlyBuilder>,
      SharedSlashCommandSubcommands<SlashCommandSubcommandsOnlyBuilder>,
      SharedSlashCommand {}

  interface SlashCommandSubcommandBuilder
    extends SharedNameAndDescription,
      SharedSlashCommandOptions<SlashCommandSubcommandBuilder>,
      BotCommandBuilderBase {}
}

class BotCommandBuilderBase {
  /**
   * The function to execute when the command is called.
   */
  public readonly execute!: BotCommandExecute

  /**
   * The metadata for the command.
   */
  public readonly metadata: object = {
    type: "command",
  }

  /**
   * Set the function to execute when the command is called.
   *
   * @param fn - The function to execute when the command is called.
   */
  setExecute(fn: BotCommandExecute) {
    Reflect.set(this, "execute", fn)
    return this
  }

  /**
   * Set the metadata for the command.
   *
   * @param metadata - The metadata for the command.
   */
  setMetadata(metadata: object) {
    Reflect.set(this, "metadata", {
      type: "command",
      ...metadata,
    })
    return this
  }
}

/**
 * A builder that creates API-compatible JSON data for slash commands.
 *
 * @extends SlashCommandBuilder
 */
export class BotCommandBuilder extends Mixin(
  BotCommandBuilderBase,
  SlashCommandBuilder,
) {
  // @ts-expect-error i'll fix this later
  toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody  {
    const {
      type,
      name_localizations,
      description_localizations,
      default_member_permissions,
      dm_permission,
      options,
      nsfw,
      ...rest
    } = super.toJSON()

    const json = CommandManager.sortCommandKeys({
      type: type ?? ApplicationCommandType.ChatInput,
      name_localizations: name_localizations ?? null,
      description_localizations: description_localizations ?? null,
      default_member_permissions: default_member_permissions ?? null,
      dm_permission: dm_permission === undefined ? true : dm_permission,
      options: options ?? [],
      nsfw: nsfw === undefined ? false : nsfw,
      ...rest,
    })

    return json
  }
}

/**
 * A builder that creates API-compatible JSON data for slash commands.
 *
 * @extends SlashCommandBuilder
 */
export class BotSubcommandBuilder extends Mixin(
  BotCommandBuilderBase,
  SlashCommandSubcommandBuilder,
) {
  toJSON(): APIApplicationCommandSubcommandOption {
    const data = super.toJSON()

    delete (data as { metadata?: unknown }).metadata
    delete (data as { execute?: unknown }).execute

    return data
  }
}
