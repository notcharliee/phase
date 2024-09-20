import {
  ApplicationCommandType,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js"

import { Mixin } from "ts-mixer"

import { BotCommandExecute } from "~/types/commands"

import type {
  ChannelType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SharedNameAndDescription,
  SharedSlashCommand,
  SharedSlashCommandOptions,
  SharedSlashCommandSubcommands,
} from "discord.js"
import { CommandManager } from "~/managers"

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
  toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
    const data = super.toJSON()

    return CommandManager.sortCommandKeys({
      name: data.name,
      name_localizations: data.name_localizations ?? null,
      description: data.description,
      nsfw: data.nsfw === undefined ? false : data.nsfw,
      description_localizations: data.description_localizations ?? null,
      type: data.type ?? ApplicationCommandType.ChatInput,
      options: data.options ?? [],
      default_member_permissions: data.default_member_permissions ?? null,
      dm_permission:
        data.dm_permission === undefined ? true : data.dm_permission,
    })
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
  toJSON() {
    const data = super.toJSON()

    delete (data as { metadata?: unknown }).metadata
    delete (data as { execute?: unknown }).execute

    return data
  }
}
