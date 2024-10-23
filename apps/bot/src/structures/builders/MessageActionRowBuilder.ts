import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from "discord.js"

import type { BuilderOrBuilderFunction } from "~/types/builders"
import type { MessageActionRowComponentBuilder } from "discord.js"

export class MessageActionRowBuilder extends ActionRowBuilder<MessageActionRowComponentBuilder> {
  public addButton(builder: BuilderOrBuilderFunction<ButtonBuilder>) {
    return super.addComponents(
      typeof builder === "function" ? builder(new ButtonBuilder()) : builder,
    ) as MessageActionRowBuilder
  }

  public addChannelSelectMenu(
    builder: BuilderOrBuilderFunction<ChannelSelectMenuBuilder>,
  ) {
    return super.addComponents(
      typeof builder === "function"
        ? builder(new ChannelSelectMenuBuilder())
        : builder,
    ) as MessageActionRowBuilder
  }

  public addMentionableSelectMenu(
    builder: BuilderOrBuilderFunction<MentionableSelectMenuBuilder>,
  ) {
    return super.addComponents(
      typeof builder === "function"
        ? builder(new MentionableSelectMenuBuilder())
        : builder,
    ) as MessageActionRowBuilder
  }

  public addRoleSelectMenu(
    builder: BuilderOrBuilderFunction<RoleSelectMenuBuilder>,
  ) {
    return super.addComponents(
      typeof builder === "function"
        ? builder(new RoleSelectMenuBuilder())
        : builder,
    ) as MessageActionRowBuilder
  }

  public addStringSelectMenu(
    builder: BuilderOrBuilderFunction<StringSelectMenuBuilder>,
  ) {
    return super.addComponents(
      typeof builder === "function"
        ? builder(new StringSelectMenuBuilder())
        : builder,
    ) as MessageActionRowBuilder
  }

  public addUserSelectMenu(
    builder: BuilderOrBuilderFunction<UserSelectMenuBuilder>,
  ) {
    return super.addComponents(
      typeof builder === "function"
        ? builder(new UserSelectMenuBuilder())
        : builder,
    ) as MessageActionRowBuilder
  }
}
