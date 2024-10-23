import { ActionRowBuilder, TextInputBuilder } from "discord.js"

import type { BuilderOrBuilderFunction } from "~/types/builders"
import type { ModalActionRowComponentBuilder } from "discord.js"

export class ModalActionRowBuilder extends ActionRowBuilder<ModalActionRowComponentBuilder> {
  public addTextInput(builder: BuilderOrBuilderFunction<TextInputBuilder>) {
    return super.addComponents(
      typeof builder === "function" ? builder(new TextInputBuilder()) : builder,
    ) as ModalActionRowBuilder
  }
}
