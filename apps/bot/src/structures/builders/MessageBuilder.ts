import { AttachmentBuilder, normalizeArray } from "discord.js"

import { ActionRowBuilder } from "~/structures/builders/ActionRowBuilder"
import { EmbedBuilder } from "~/structures/builders/EmbedBuilder"

import type { ActionRowBuilderReturnType } from "~/structures/builders/ActionRowBuilder"
import type { BuilderOrBuilderFunction } from "~/types/builders"
import type {
  APIEmbed,
  APIMessageComponent,
  APIModalComponent,
  AttachmentPayload,
  BaseMessageOptions,
  MessageMentionOptions,
  RestOrArray,
} from "discord.js"

export class MessageBuilder {
  readonly allowedMentions?: BaseMessageOptions["allowedMentions"]
  readonly content?: BaseMessageOptions["content"]
  readonly components?: BaseMessageOptions["components"]
  readonly embeds?: BaseMessageOptions["embeds"]
  readonly files?: BaseMessageOptions["files"]

  constructor(data?: BaseMessageOptions) {
    this.allowedMentions = data?.allowedMentions
    this.content = data?.content
    this.components = data?.components
    this.embeds = data?.embeds
    this.files = data?.files
  }

  setAllowedMentions(allowedMentions: MessageMentionOptions) {
    Reflect.set(this, "allowedMentions", allowedMentions)
    return this
  }

  setContent(content: string) {
    Reflect.set(this, "content", content)
    return this
  }

  setComponents(
    ...builders: RestOrArray<
      BuilderOrBuilderFunction<ActionRowBuilder, ActionRowBuilderReturnType>
    >
  ) {
    const normalisedBuilders = normalizeArray(builders)
    const actionRows: (APIMessageComponent | APIModalComponent)[] = []

    for (const builder of normalisedBuilders) {
      actionRows.push(
        typeof builder === "function"
          ? builder(new ActionRowBuilder()).toJSON()
          : builder.toJSON(),
      )
    }

    Reflect.set(this, "components", actionRows)

    return this
  }

  setEmbeds(...builders: RestOrArray<BuilderOrBuilderFunction<EmbedBuilder>>) {
    const normalisedBuilders = normalizeArray(builders)
    const embeds: APIEmbed[] = []

    for (const builder of normalisedBuilders) {
      if (builder instanceof EmbedBuilder) embeds.push(builder.toJSON())
      else embeds.push(builder(new EmbedBuilder()).toJSON())
    }

    Reflect.set(this, "embeds", embeds)

    return this
  }

  setFiles(
    ...builders: RestOrArray<BuilderOrBuilderFunction<AttachmentBuilder>>
  ) {
    const normalisedBuilders = normalizeArray(builders)
    const attachments: AttachmentPayload[] = []

    for (const builder of normalisedBuilders) {
      if (builder instanceof AttachmentBuilder) {
        attachments.push({
          name: builder.name ?? undefined,
          description: builder.description ?? undefined,
          attachment: builder.attachment,
        })
      } else {
        const emptyBuffer = Buffer.alloc(0)
        const attachmentBuilder = builder(new AttachmentBuilder(emptyBuffer))
        attachments.push({
          name: attachmentBuilder.name ?? undefined,
          description: attachmentBuilder.description ?? undefined,
          attachment: attachmentBuilder.attachment,
        })
      }
    }

    Reflect.set(this, "files", attachments)

    return this
  }

  toJSON(): BaseMessageOptions {
    return {
      allowedMentions: this.allowedMentions,
      content: this.content,
      components: this.components,
      embeds: this.embeds,
      files: this.files,
    }
  }
}
