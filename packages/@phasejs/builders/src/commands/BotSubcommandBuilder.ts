import { BotCommand } from "@phasejs/core/client"
import { ApplicationCommandOptionType } from "discord.js"

import { Mixin } from "ts-mixer"
import { z } from "zod"

import { SharedBotCommandBuilderBase } from "./shared/SharedBotCommandBuilderBase"
import { SharedBotCommandBuilderDescription } from "./shared/SharedBotCommandBuilderDescription"
import { SharedBotCommandBuilderName } from "./shared/SharedBotCommandBuilderName"
import { SharedBotCommandBuilderOptions } from "./shared/SharedBotCommandBuilderOptions"

import type { BotSubcommandBody, DjsClient } from "@phasejs/core"

export class BotSubcommandBuilder extends Mixin(
  SharedBotCommandBuilderBase,
  SharedBotCommandBuilderName,
  SharedBotCommandBuilderDescription,
  SharedBotCommandBuilderOptions,
) {
  declare protected body: BotSubcommandBody

  constructor() {
    super()

    this.body.type = ApplicationCommandOptionType.Subcommand
  }

  /**
   * Builds the subcommand.
   */
  public build(
    client: DjsClient,
    params: { parentName?: string; groupName?: string } = {},
  ) {
    return new BotCommand(client, {
      ...params,
      body: this.body,
      metadata: this.metadata,
      execute: this.execute,
    })
  }

  /**
   * Creates a subcommand builder from a subcommand.
   */
  static from(command: BotCommand) {
    const builder = new BotSubcommandBuilder()

    builder.setName(command.name)
    builder.setDescription(command.description)
    builder.setMetadata(command.metadata)
    builder.setExecute(command.execute)

    if (command.nameLocalisations) {
      builder.setNameLocalisations(command.nameLocalisations)
    }

    if (command.descriptionLocalisations) {
      builder.setDescriptionLocalisations(command.descriptionLocalisations)
    }

    if (command.options) {
      builder.setOptions(command.options)
    }

    return builder
  }

  /**
   * Checks if something is a subcommand builder.
   */
  static isBuilder(thing: unknown): thing is BotSubcommandBuilder {
    const schema = z
      .object({
        setName: z.function(),
        setNameLocalisations: z.function(),
        setDescription: z.function(),
        setDescriptionLocalisations: z.function(),
        setOptions: z.function(),
        setMetadata: z.function(),
        setExecute: z.function(),
        // these are not supported in subcommands
        setDMPermission: z.never().optional(),
        setContexts: z.never().optional(),
        setIntegrationTypes: z.never().optional(),
      })
      .passthrough()

    return schema.safeParse(thing).success
  }
}
