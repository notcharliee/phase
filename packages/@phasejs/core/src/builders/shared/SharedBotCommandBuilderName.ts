import { SlashCommandAssertions } from "discord.js"

import type { BotCommandOrSubcommandBody } from "~/types/commands"
import type { LocalizationMap } from "discord.js"

export class SharedBotCommandBuilderName {
  declare protected body: BotCommandOrSubcommandBody

  /**
   * Sets the name of this command.
   */
  public setName(name: string) {
    SlashCommandAssertions.validateName(name)
    this.body.name = name
    return this
  }

  /**
   * Sets the name localisations of this command.
   */
  public setNameLocalisations(localisations: LocalizationMap) {
    SlashCommandAssertions.validateLocalizationMap(localisations)
    this.body.name_localizations = localisations
    return this
  }
}
