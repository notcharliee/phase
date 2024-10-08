import { AttachmentBuilder, normalizeArray } from "discord.js"

import { CustomActionRowBuilder } from "~/structures/CustomActionRowBuilder"
import { CustomEmbedBuilder } from "~/structures/CustomEmbedBuilder"

import type { CustomActionRowBuilderReturnType } from "~/structures/CustomActionRowBuilder"
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

export class CustomMessageBuilder {
  readonly allowedMentions?: BaseMessageOptions["allowedMentions"]
  readonly content?: BaseMessageOptions["content"]
  readonly components?: BaseMessageOptions["components"]
  readonly embeds?: BaseMessageOptions["embeds"]
  readonly files?: BaseMessageOptions["files"]

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
      BuilderOrBuilderFunction<
        CustomActionRowBuilder,
        CustomActionRowBuilderReturnType
      >
    >
  ) {
    const normalisedBuilders = normalizeArray(builders)
    const actionRows: (APIMessageComponent | APIModalComponent)[] = []

    for (const builder of normalisedBuilders) {
      actionRows.push(
        typeof builder === "function"
          ? builder(new CustomActionRowBuilder()).toJSON()
          : builder.toJSON(),
      )
    }

    Reflect.set(this, "components", actionRows)

    return this
  }

  setEmbeds(
    ...builders: RestOrArray<BuilderOrBuilderFunction<CustomEmbedBuilder>>
  ) {
    const normalisedBuilders = normalizeArray(builders)
    const embeds: APIEmbed[] = []

    for (const builder of normalisedBuilders) {
      if (builder instanceof CustomEmbedBuilder) embeds.push(builder.toJSON())
      else embeds.push(builder(new CustomEmbedBuilder()).toJSON())
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
