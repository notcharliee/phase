import { Mixin } from "ts-mixer"

import { MessageActionRowBuilder } from "~/structures/builders/MessageActionRowBuilder"
import { ModalActionRowBuilder } from "~/structures/builders/ModalActionRowBuilder"

export type ActionRowBuilderReturnType =
  | MessageActionRowBuilder
  | ModalActionRowBuilder

export class ActionRowBuilder extends Mixin(
  MessageActionRowBuilder,
  ModalActionRowBuilder,
) {}
