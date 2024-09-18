import { ActionRowBuilder, AttachmentBuilder, normalizeArray } from "discord.js"

import { CustomEmbedBuilder } from "~/lib/builders/embed"

import type {
  APIActionRowComponent,
  APIEmbed,
  APIMessageActionRowComponent,
  APIMessageComponent,
  AttachmentPayload,
  BaseMessageOptions,
  MessageActionRowComponentBuilder,
  MessageMentionOptions,
  PollData,
  RestOrArray,
} from "discord.js"

type BuilderOrBuilderFunction<T> = T | ((builder: T) => T)

type MessageActionRowBuilder =
  ActionRowBuilder<MessageActionRowComponentBuilder>

export class CustomMessageBuilder {
  readonly allowedMentions?: MessageMentionOptions
  readonly content?: string
  readonly components?: APIActionRowComponent<APIMessageActionRowComponent>[]
  readonly embeds?: APIEmbed[]
  readonly files?: AttachmentPayload[]
  readonly poll?: PollData

  setAllowedMentions(allowedMentions: MessageMentionOptions) {
    Reflect.set(this, "allowedMentions", allowedMentions)
    return this
  }

  setContent(content: string) {
    Reflect.set(this, "content", content)
    return this
  }

  setComponents(
    ...builders: RestOrArray<BuilderOrBuilderFunction<MessageActionRowBuilder>>
  ) {
    const normalisedBuilders = normalizeArray(builders)
    const actionRows: APIMessageComponent[] = []

    for (const builder of normalisedBuilders) {
      if (builder instanceof ActionRowBuilder) actionRows.push(builder.toJSON())
      else actionRows.push(builder(new ActionRowBuilder()).toJSON())
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
        attachments.push(builder.toJSON() as AttachmentPayload)
      } else {
        const emptyBuffer = Buffer.alloc(0)
        const attachmentBuilder = builder(new AttachmentBuilder(emptyBuffer))
        attachments.push(attachmentBuilder.toJSON() as AttachmentPayload)
      }
    }

    Reflect.set(this, "files", attachments)

    return this
  }

  setPoll(poll: PollData) {
    Reflect.set(this, "poll", poll)
    return this
  }

  toJSON(): BaseMessageOptions {
    return {
      allowedMentions: this.allowedMentions,
      content: this.content,
      components: this.components,
      embeds: this.embeds,
      files: this.files,
      poll: this.poll,
    }
  }
}
