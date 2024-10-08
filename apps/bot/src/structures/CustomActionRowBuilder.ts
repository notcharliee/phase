import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  UserSelectMenuBuilder,
} from "discord.js"

import { Mixin } from "ts-mixer"

import type { BuilderOrBuilderFunction } from "~/types/builders"
import type {
  MessageActionRowComponentBuilder,
  ModalActionRowComponentBuilder,
} from "discord.js"

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

export class ModalActionRowBuilder extends ActionRowBuilder<ModalActionRowComponentBuilder> {
  public addTextInput(builder: BuilderOrBuilderFunction<TextInputBuilder>) {
    return super.addComponents(
      typeof builder === "function" ? builder(new TextInputBuilder()) : builder,
    ) as ModalActionRowBuilder
  }
}

export type CustomActionRowBuilderReturnType =
  | MessageActionRowBuilder
  | ModalActionRowBuilder

export class CustomActionRowBuilder extends Mixin(
  MessageActionRowBuilder,
  ModalActionRowBuilder,
) {}
