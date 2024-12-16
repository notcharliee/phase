import {
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js"

import { resolveBuilder } from "~/lib/resolvers"

import type { BotCommandOrSubcommandBody } from "@phasejs/core"
import type { BuilderOrBuilderFunction } from "~/types/builders"
import type {
  APIApplicationCommandOption,
  ApplicationCommandOptionBase,
} from "discord.js"

export class SharedBotCommandBuilderOptions {
  declare protected body: BotCommandOrSubcommandBody

  /**
   * Adds an attachment option.
   */
  public addAttachmentOption(
    option: BuilderOrBuilderFunction<SlashCommandAttachmentOption>,
  ) {
    return this.sharedAddOption(SlashCommandAttachmentOption, option)
  }

  /**
   * Adds a boolean option.
   */
  public addBooleanOption(
    option: BuilderOrBuilderFunction<SlashCommandBooleanOption>,
  ) {
    return this.sharedAddOption(SlashCommandBooleanOption, option)
  }

  /**
   * Adds a channel option.
   */
  public addChannelOption(
    option: BuilderOrBuilderFunction<SlashCommandChannelOption>,
  ) {
    return this.sharedAddOption(SlashCommandChannelOption, option)
  }

  /**
   * Adds an integer option.
   */
  public addIntegerOption(
    option: BuilderOrBuilderFunction<SlashCommandIntegerOption>,
  ) {
    return this.sharedAddOption(SlashCommandIntegerOption, option)
  }

  /**
   * Adds a mentionable option.
   */
  public addMentionableOption(
    option: BuilderOrBuilderFunction<SlashCommandMentionableOption>,
  ) {
    return this.sharedAddOption(SlashCommandMentionableOption, option)
  }

  /**
   * Adds a number option.
   */
  public addNumberOption(
    option: BuilderOrBuilderFunction<SlashCommandNumberOption>,
  ) {
    return this.sharedAddOption(SlashCommandNumberOption, option)
  }

  /**
   * Adds a role option.
   */
  public addRoleOption(
    option: BuilderOrBuilderFunction<SlashCommandRoleOption>,
  ) {
    return this.sharedAddOption(SlashCommandRoleOption, option)
  }

  /**
   * Adds a string option.
   */
  public addStringOption(
    option: BuilderOrBuilderFunction<SlashCommandStringOption>,
  ) {
    return this.sharedAddOption(SlashCommandStringOption, option)
  }

  /**
   * Adds a user option.
   */
  public addUserOption(
    option: BuilderOrBuilderFunction<SlashCommandUserOption>,
  ) {
    return this.sharedAddOption(SlashCommandUserOption, option)
  }

  /**
   * Sets the options for this command.
   *
   * @remarks This will overwrite any previously set options.
   */
  public setOptions(options: APIApplicationCommandOption[]) {
    this.body.options = options
    return this
  }

  /**
   * Adds an option.
   *
   * @internal
   */
  private sharedAddOption<OptionBuilder extends ApplicationCommandOptionBase>(
    Instance: new () => OptionBuilder,
    option: BuilderOrBuilderFunction<OptionBuilder>,
  ): this {
    const resolved = resolveBuilder(option, Instance)

    this.body.options ??= []
    this.body.options.push(resolved.toJSON())

    return this
  }
}
