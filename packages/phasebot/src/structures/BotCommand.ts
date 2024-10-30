import {
  APIApplicationCommandOption,
  ApplicationCommand,
  ApplicationCommandOption,
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  Client,
} from "discord.js"

import { isEqual, isNil } from "lodash"

import type {
  BotCommandBody,
  BotCommandExecute,
  BotCommandMetadata,
  BotCommandOrSubcommandBody,
  BotSubcommandBody,
} from "~/types/commands"

export class BotCommand {
  protected _client: Client
  protected _body: BotCommandOrSubcommandBody

  public readonly parentName?: string
  public readonly groupName?: string

  public readonly type: BotCommandOrSubcommandBody["type"]
  public readonly name: BotCommandOrSubcommandBody["name"]
  public readonly nameLocalisations: BotCommandOrSubcommandBody["name_localizations"]
  public readonly description: BotCommandOrSubcommandBody["description"]
  public readonly descriptionLocalisations: BotCommandOrSubcommandBody["description_localizations"]
  public readonly options: BotCommandOrSubcommandBody["options"]

  public readonly integrationTypes: BotCommandBody["integration_types"]
  public readonly contexts: BotCommandBody["contexts"]
  public readonly dmPermission: BotCommandBody["dm_permission"]

  public readonly metadata: BotCommandMetadata
  public readonly execute: BotCommandExecute

  constructor(
    client: Client,
    params: {
      parentName?: string
      groupName?: string
      body: BotCommandOrSubcommandBody
      metadata: BotCommandMetadata
      execute: BotCommandExecute
    },
  ) {
    this._client = client
    this._body = params.body

    if (params.parentName) {
      this.parentName = params.parentName

      if (params.groupName) {
        this.groupName = params.groupName
      }
    }

    this.type = this._body.type
    this.name = this._body.name
    this.description = this._body.description

    if ("name_localizations" in this._body) {
      if (this._body.name_localizations) {
        this.nameLocalisations = this._body.name_localizations
      } else {
        delete this._body.name_localizations
      }
    }

    if ("description_localizations" in this._body) {
      if (this._body.description_localizations) {
        this.descriptionLocalisations = this._body.description_localizations
      } else {
        delete this._body.description_localizations
      }
    }

    if ("options" in this._body) {
      if (this._body.options) {
        const transformedOptions = this._body.options.map((option) => {
          return BotCommand.transformOption(option)
        })

        this._body.options = transformedOptions
        this.options = transformedOptions
      } else {
        delete this._body.options
      }
    }

    if (!this.isSubcommandBody(this._body)) {
      this.integrationTypes = this._body.integration_types
      this.contexts = this._body.contexts
      this.dmPermission = this._body.dm_permission
    }

    this.metadata = params.metadata
    this.execute = params.execute
  }

  /**
   * Returns the command body as a JSON object.
   */
  public toJSON(): BotCommandBody {
    if (!this.isSubcommandBody(this._body)) {
      return this._body
    }

    return {
      type: ApplicationCommandType.ChatInput,
      name: this.parentName!,
      description: this.parentName!,
      options: [
        this.groupName
          ? {
              type: ApplicationCommandOptionType.SubcommandGroup,
              name: this.groupName!,
              description: this.groupName!,
              options: [this._body as BotSubcommandBody],
            }
          : {
              ...(this._body as BotSubcommandBody),
            },
      ],
      integration_types: [ApplicationIntegrationType.GuildInstall],
      dm_permission: true,
    }
  }

  private isSubcommandBody(
    body: BotCommandOrSubcommandBody,
  ): body is BotSubcommandBody {
    return this.parentName !== undefined
  }

  /**
   * Compares two {@link BotCommand} bodies for equality.
   */
  static equals(a: BotCommandBody, b: BotCommandBody) {
    return isEqual(a, b)
  }

  /**
   * Transforms an {@link ApplicationCommandOption} into a format compatible with the Discord API.
   */
  static transformOption<
    TReturn extends APIApplicationCommandOption = APIApplicationCommandOption,
  >(
    option: ApplicationCommandOptionData | APIApplicationCommandOption,
  ): TReturn {
    const transformedOption: Record<string, unknown> = {
      type: option.type,
      name: option.name,
      description: option.description,
    }

    const assignProp = (camelProp: string, snakeProp: string) => {
      type Prop = keyof typeof option

      if (camelProp in option && !isNil(option[camelProp as Prop])) {
        transformedOption[snakeProp] = option[camelProp as Prop]
      }
      if (snakeProp in option && !isNil(option[snakeProp as Prop])) {
        transformedOption[snakeProp] = option[snakeProp as Prop]
      }
    }

    assignProp("nameLocalizations", "name_localizations")
    assignProp("descriptionLocalizations", "description_localizations")
    assignProp("required", "required")
    assignProp("autocomplete", "autocomplete")
    assignProp("channelTypes", "channel_types")
    assignProp("minValue", "min_value")
    assignProp("maxValue", "max_value")
    assignProp("minLength", "min_length")
    assignProp("maxLength", "max_length")

    if ("choices" in option && option.choices) {
      transformedOption.choices = option.choices.map((c) => {
        const transformedChoice: Record<string, unknown> = {
          name: c.name,
          value: c.value,
        }

        if ("nameLocalizations" in c && !isNil(c.nameLocalizations)) {
          transformedChoice.name_localizations = c.nameLocalizations
        }
        if ("name_localizations" in c && !isNil(c.name_localizations)) {
          transformedChoice.name_localizations = c.name_localizations
        }

        return transformedChoice
      })
    }

    if ("options" in option && option.options) {
      transformedOption.options = option.options.map((opt) =>
        this.transformOption(opt),
      )
    }

    return transformedOption as TReturn
  }

  /**
   * Transforms an {@link ApplicationCommand} into something that can be
   * used in the Discord API.
   */
  static transformCommand(command: ApplicationCommand): BotCommandBody {
    const transformedCommand: BotCommandBody = {
      type: ApplicationCommandType.ChatInput,
      name: command.name,
      description: command.description,
      options:
        command.options.map((option) =>
          this.transformOption(option as ApplicationCommandOptionData),
        ) ?? [],
      integration_types: command.integrationTypes ?? [
        ApplicationIntegrationType.GuildInstall,
      ],
      dm_permission: !isNil(command.dmPermission) ? command.dmPermission : true,
    }

    if (command.nameLocalizations) {
      transformedCommand.name_localizations = command.nameLocalizations
    }

    if (command.descriptionLocalizations) {
      transformedCommand.description_localizations =
        command.descriptionLocalizations
    }

    if (command.contexts) {
      transformedCommand.contexts = command.contexts
    }

    return transformedCommand
  }
}
