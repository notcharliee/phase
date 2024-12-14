import { BotEventBuilder } from "@phasejs/core/builders"
import {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"

import { BotErrorMessage } from "~/structures/BotError"

import type {
  GuildTextBasedChannel,
  ModalActionRowComponentBuilder,
} from "discord.js"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (_, interaction) => {
    if (
      interaction.isModalSubmit() &&
      interaction.isFromMessage() &&
      /embedbuilder\.(author|body|image|footer)/.test(interaction.customId)
    ) {
      switch (interaction.customId) {
        case "embedbuilder.author":
          {
            let authorTextComponentValue: string | null =
              interaction.fields.getTextInputValue("embedbuilder.author.name")
            let authorURLComponentValue: string | undefined =
              interaction.fields.getTextInputValue("embedbuilder.author.url")
            let authorIconComponentValue: string | undefined =
              interaction.fields.getTextInputValue("embedbuilder.author.icon")

            if (!authorTextComponentValue.length)
              authorTextComponentValue = null
            if (!authorURLComponentValue.length)
              authorURLComponentValue = undefined
            if (!authorIconComponentValue.length)
              authorIconComponentValue = undefined

            if (
              interaction.message.embeds[0]!.title == null &&
              interaction.message.embeds[0]!.description == null &&
              interaction.message.embeds[0]!.url == null &&
              interaction.message.embeds[0]!.image == null &&
              interaction.message.embeds[0]!.thumbnail == null &&
              authorTextComponentValue == null &&
              interaction.message.embeds[0]!.footer == null
            ) {
              return interaction.reply(
                new BotErrorMessage("You cannot send an empty embed.").toJSON(),
              )
            }

            void interaction.message.edit({
              embeds: [
                new EmbedBuilder()
                  .setAuthor(
                    authorTextComponentValue
                      ? {
                          iconURL: authorIconComponentValue,
                          name: authorTextComponentValue,
                          url: authorURLComponentValue,
                        }
                      : null,
                  )
                  .setColor(
                    `#${interaction.message.embeds[0]!.hexColor?.replace("#", "")}`,
                  )
                  .setDescription(interaction.message.embeds[0]!.description)
                  .setFooter(interaction.message.embeds[0]!.footer)
                  .setImage(interaction.message.embeds[0]!.image?.url ?? null)
                  .setThumbnail(
                    interaction.message.embeds[0]!.thumbnail?.url ?? null,
                  )
                  .setTitle(interaction.message.embeds[0]!.title)
                  .setURL(interaction.message.embeds[0]!.url),
              ],
            })

            void interaction.deferUpdate()
          }
          break

        case "embedbuilder.body":
          {
            let bodyTitleComponentValue: string | null =
              interaction.fields.getTextInputValue("embedbuilder.body.title")
            let bodyDescriptionComponentValue: string | null =
              interaction.fields.getTextInputValue(
                "embedbuilder.body.description",
              )
            let bodyURLComponentValue: string | null =
              interaction.fields.getTextInputValue("embedbuilder.body.url")
            let bodyColourComponentValue: string | null =
              interaction.fields.getTextInputValue("embedbuilder.body.colour")

            if (!bodyTitleComponentValue.length) bodyTitleComponentValue = null
            if (!bodyDescriptionComponentValue.length)
              bodyDescriptionComponentValue = null
            if (!bodyURLComponentValue.length) bodyURLComponentValue = null
            if (
              !bodyColourComponentValue.length ||
              !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(
                bodyColourComponentValue,
              )
            )
              bodyColourComponentValue = null

            if (
              bodyTitleComponentValue == null &&
              bodyDescriptionComponentValue == null &&
              bodyURLComponentValue == null &&
              interaction.message.embeds[0]!.image == null &&
              interaction.message.embeds[0]!.thumbnail == null &&
              interaction.message.embeds[0]!.author == null &&
              interaction.message.embeds[0]!.footer == null
            ) {
              return interaction.reply(
                new BotErrorMessage("You cannot send an empty embed.").toJSON(),
              )
            }

            void interaction.message.edit({
              embeds: [
                new EmbedBuilder()
                  .setAuthor(interaction.message.embeds[0]!.author)
                  .setColor(
                    bodyColourComponentValue
                      ? `#${bodyColourComponentValue.replace("#", "")}`
                      : null,
                  )
                  .setDescription(bodyDescriptionComponentValue)
                  .setFooter(interaction.message.embeds[0]!.footer)
                  .setImage(interaction.message.embeds[0]!.image?.url ?? null)
                  .setThumbnail(
                    interaction.message.embeds[0]!.thumbnail?.url ?? null,
                  )
                  .setTitle(bodyTitleComponentValue)
                  .setURL(bodyURLComponentValue),
              ],
            })

            void interaction.deferUpdate()
          }
          break

        case "embedbuilder.image":
          {
            let imageMainComponentValue: string | null =
              interaction.fields.getTextInputValue("embedbuilder.image.main")
            let imageThumbnailComponentValue: string | null =
              interaction.fields.getTextInputValue(
                "embedbuilder.image.thumbnail",
              )

            if (!imageMainComponentValue.length) imageMainComponentValue = null
            if (!imageThumbnailComponentValue.length)
              imageThumbnailComponentValue = null

            if (
              interaction.message.embeds[0]!.title == null &&
              interaction.message.embeds[0]!.description == null &&
              interaction.message.embeds[0]!.url == null &&
              imageMainComponentValue == null &&
              imageThumbnailComponentValue == null &&
              interaction.message.embeds[0]!.author == null &&
              interaction.message.embeds[0]!.footer == null
            ) {
              return interaction.reply(
                new BotErrorMessage("You cannot send an empty embed.").toJSON(),
              )
            }

            void interaction.message.edit({
              embeds: [
                new EmbedBuilder()
                  .setAuthor(interaction.message.embeds[0]!.author)
                  .setColor(
                    `#${interaction.message.embeds[0]!.hexColor?.replace("#", "")}`,
                  )
                  .setDescription(interaction.message.embeds[0]!.description)
                  .setFooter(interaction.message.embeds[0]!.footer)
                  .setImage(imageMainComponentValue)
                  .setThumbnail(imageThumbnailComponentValue)
                  .setTitle(interaction.message.embeds[0]!.title)
                  .setURL(interaction.message.embeds[0]!.url),
              ],
            })

            void interaction.deferUpdate()
          }
          break

        case "embedbuilder.footer":
          {
            let footerTextComponentValue: string | null =
              interaction.fields.getTextInputValue("embedbuilder.footer.text")
            let footerIconComponentValue: string | undefined =
              interaction.fields.getTextInputValue("embedbuilder.footer.icon")

            if (!footerTextComponentValue.length)
              footerTextComponentValue = null
            if (!footerIconComponentValue.length)
              footerIconComponentValue = undefined

            if (
              interaction.message.embeds[0]!.title == null &&
              interaction.message.embeds[0]!.description == null &&
              interaction.message.embeds[0]!.url == null &&
              interaction.message.embeds[0]!.image == null &&
              interaction.message.embeds[0]!.thumbnail == null &&
              interaction.message.embeds[0]!.author == null &&
              footerTextComponentValue == null
            ) {
              return interaction.reply(
                new BotErrorMessage("You cannot send an empty embed.").toJSON(),
              )
            }

            void interaction.message.edit({
              embeds: [
                new EmbedBuilder()
                  .setAuthor(interaction.message.embeds[0]!.author)
                  .setColor(
                    `#${interaction.message.embeds[0]!.hexColor?.replace("#", "")}`,
                  )
                  .setDescription(interaction.message.embeds[0]!.description)
                  .setFooter(
                    footerTextComponentValue
                      ? {
                          text: footerTextComponentValue,
                          iconURL: footerIconComponentValue,
                        }
                      : null,
                  )
                  .setImage(interaction.message.embeds[0]!.image?.url ?? null)
                  .setThumbnail(
                    interaction.message.embeds[0]!.thumbnail?.url ?? null,
                  )
                  .setTitle(interaction.message.embeds[0]!.title)
                  .setURL(interaction.message.embeds[0]!.url),
              ],
            })

            void interaction.deferUpdate()
          }
          break
      }
    }

    if (
      interaction.isButton() &&
      /embedbuilder\.(author|body|image|footer|send)/.test(interaction.customId)
    ) {
      if (
        interaction.user.id != interaction.message.interactionMetadata?.user.id
      ) {
        return interaction.reply(
          new BotErrorMessage("You cannot edit someone else's embed.").toJSON(),
        )
      }

      switch (interaction.customId) {
        case "embedbuilder.author":
          {
            const authorTextComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.author.name")
              .setLabel("Author Name")
              .setMaxLength(256)
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.author?.name)
              authorTextComponent.setValue(
                interaction.message.embeds[0]!.author.name,
              )

            const authorURLComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.author.url")
              .setLabel("Author URL")
              .setPlaceholder("https://phasebot.xyz")
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.author?.url)
              authorURLComponent.setValue(
                interaction.message.embeds[0]!.author.url,
              )

            const authorIconComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.author.icon")
              .setLabel("Author Icon URL")
              .setPlaceholder("https://phasebot.xyz/phase.png")
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.author?.iconURL)
              authorIconComponent.setValue(
                interaction.message.embeds[0]!.author.iconURL,
              )

            const modalAuthorText =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                authorTextComponent,
              )
            const modalAuthorURL =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                authorURLComponent,
              )
            const modalAuthorIcon =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                authorIconComponent,
              )

            const modal = new ModalBuilder()
              .addComponents(modalAuthorText, modalAuthorURL, modalAuthorIcon)
              .setCustomId(`embedbuilder.author`)
              .setTitle("Embed Builder")

            await interaction.showModal(modal)
          }
          break

        case "embedbuilder.body":
          {
            const bodyTitleComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.body.title")
              .setLabel("Body Title")
              .setMaxLength(256)
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.title)
              bodyTitleComponent.setValue(interaction.message.embeds[0]!.title)

            const bodyDescriptionComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.body.description")
              .setLabel("Body Description")
              .setMaxLength(4000)
              .setRequired(false)
              .setStyle(TextInputStyle.Paragraph)

            if (interaction.message.embeds[0]!.description)
              bodyDescriptionComponent.setValue(
                interaction.message.embeds[0]!.description,
              )

            const bodyURLComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.body.url")
              .setLabel("Body URL")
              .setPlaceholder("https://phasebot.xyz")
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.url)
              bodyURLComponent.setValue(interaction.message.embeds[0]!.url)

            const bodyColourComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.body.colour")
              .setLabel("Body Colour")
              .setMaxLength(7)
              .setMinLength(7)
              .setPlaceholder("#RRGGBB")
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.hexColor)
              bodyColourComponent.setValue(
                interaction.message.embeds[0]!.hexColor,
              )

            const modalBodyTitle =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                bodyTitleComponent,
              )
            const modalBodyDescription =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                bodyDescriptionComponent,
              )
            const modalBodyURL =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                bodyURLComponent,
              )
            const modalBodyColour =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                bodyColourComponent,
              )

            const modal = new ModalBuilder()
              .addComponents(
                modalBodyTitle,
                modalBodyDescription,
                modalBodyURL,
                modalBodyColour,
              )
              .setCustomId(`embedbuilder.body`)
              .setTitle("Embed Builder")

            await interaction.showModal(modal)
          }
          break

        case "embedbuilder.image":
          {
            const imageMainComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.image.main")
              .setLabel("Image URL")
              .setPlaceholder("https://phasebot.xyz/phase.png")
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.image)
              imageMainComponent.setValue(
                interaction.message.embeds[0]!.image.url,
              )

            const imageThumbnailComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.image.thumbnail")
              .setLabel("Thumbnail URL")
              .setPlaceholder("https://phasebot.xyz")
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.thumbnail)
              imageThumbnailComponent.setValue(
                interaction.message.embeds[0]!.thumbnail.url,
              )

            const modalImageMain =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                imageMainComponent,
              )
            const modalImageThumbnail =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                imageThumbnailComponent,
              )

            const modal = new ModalBuilder()
              .addComponents(modalImageMain, modalImageThumbnail)
              .setCustomId(`embedbuilder.image`)
              .setTitle("Embed Builder")

            await interaction.showModal(modal)
          }
          break

        case "embedbuilder.footer":
          {
            const footerTextComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.footer.text")
              .setLabel("Footer Text")
              .setMaxLength(256)
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.footer?.text)
              footerTextComponent.setValue(
                interaction.message.embeds[0]!.footer.text,
              )

            const footerIconComponent = new TextInputBuilder()
              .setCustomId("embedbuilder.footer.icon")
              .setLabel("Footer Icon URL")
              .setPlaceholder("https://phasebot.xyz/phase.png")
              .setRequired(false)
              .setStyle(TextInputStyle.Short)

            if (interaction.message.embeds[0]!.footer?.iconURL)
              footerIconComponent.setValue(
                interaction.message.embeds[0]!.footer.iconURL,
              )

            const modalFooterText =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                footerTextComponent,
              )
            const modalFooterIcon =
              new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
                footerIconComponent,
              )

            const modal = new ModalBuilder()
              .addComponents(modalFooterText, modalFooterIcon)
              .setCustomId(`embedbuilder.footer`)
              .setTitle("Embed Builder")

            await interaction.showModal(modal)
          }
          break

        case "embedbuilder.send":
          {
            void (interaction.channel as GuildTextBasedChannel).send({
              embeds: [
                new EmbedBuilder()
                  .setAuthor(interaction.message.embeds[0]!.author)
                  .setColor(
                    `#${interaction.message.embeds[0]!.hexColor?.replace("#", "")}`,
                  )
                  .setDescription(interaction.message.embeds[0]!.description)
                  .setFooter(interaction.message.embeds[0]!.footer)
                  .setImage(interaction.message.embeds[0]!.image?.url ?? null)
                  .setThumbnail(
                    interaction.message.embeds[0]!.thumbnail?.url ?? null,
                  )
                  .setTitle(interaction.message.embeds[0]!.title)
                  .setURL(interaction.message.embeds[0]!.url),
              ],
            })

            void interaction.message.delete()
          }
          break
      }
    }
  })
