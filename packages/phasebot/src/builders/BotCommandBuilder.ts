import { SlashCommandBuilder } from "discord.js"

import { Mixin } from "ts-mixer"

import type {
  APIApplicationCommandOption,
  ChannelType,
  ChatInputCommandInteraction,
  SharedNameAndDescription,
  SharedSlashCommand,
  SharedSlashCommandOptions,
  SharedSlashCommandSubcommands,
  ToAPIApplicationCommandOptions,
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
}

export type BotCommandExecute = (
  interaction: ChatInputCommandInteraction,
) => unknown | Promise<unknown>

export type BotCommandMiddleware = (
  interaction: ChatInputCommandInteraction,
  execute: BotCommandExecute,
) => unknown | Promise<unknown>

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
 * A builder that creates API-compatible JSON data for phasebot slash commands.
 * @extends SlashCommandBuilder
 */
export class BotCommandBuilder extends Mixin(
  BotCommandBuilderBase,
  SlashCommandBuilder,
) {
  /**
   * The options for the command.
   *
   * @param options - The options for the command.
   */
  setOptions(options: APIApplicationCommandOption[]) {
    const toAPIApplicationCommandOptions: ToAPIApplicationCommandOptions[] =
      options.map((option) => ({
        toJSON: () => option,
      }))

    Reflect.set(this, "options", toAPIApplicationCommandOptions)
    return this
  }
}
