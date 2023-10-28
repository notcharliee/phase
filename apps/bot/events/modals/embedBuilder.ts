import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientModalEvent({
  customId: /embedbuilder\.(author|body|image|footer)/,
  fromMessage: true,
  async execute(client, interaction) {

    switch (interaction.customId) {

      case 'embedbuilder.author': {

        let authorTextComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.author.name')
        let authorURLComponentValue: string | undefined = interaction.fields.getTextInputValue('embedbuilder.author.url')
        let authorIconComponentValue: string | undefined = interaction.fields.getTextInputValue('embedbuilder.author.icon')

        if (!authorTextComponentValue.length) authorTextComponentValue = null
        if (!authorURLComponentValue.length) authorURLComponentValue = undefined
        if (!authorIconComponentValue.length) authorIconComponentValue = undefined

        if (
          interaction.message.embeds[0].title == null &&
          interaction.message.embeds[0].description == null &&
          interaction.message.embeds[0].url == null &&
          interaction.message.embeds[0].image == null &&
          interaction.message.embeds[0].thumbnail == null &&
          authorTextComponentValue == null &&
          interaction.message.embeds[0].footer == null
        ) return Utils.Functions.clientError(
          interaction,
          'No can do!',
          'You cannot send an empty embed.',
          true
        )

        interaction.message.edit({
          embeds: [
            new Discord.EmbedBuilder()
              .setAuthor(authorTextComponentValue ? { iconURL: authorIconComponentValue, name: authorTextComponentValue, url: authorURLComponentValue } : null)
              .setColor(`#${interaction.message.embeds[0].hexColor?.replace('#', '')}`)
              .setDescription(interaction.message.embeds[0].description)
              .setFooter(interaction.message.embeds[0].footer)
              .setImage(interaction.message.embeds[0].image?.url ?? null)
              .setThumbnail(interaction.message.embeds[0].thumbnail?.url ?? null)
              .setTitle(interaction.message.embeds[0].title)
              .setURL(interaction.message.embeds[0].url)
          ]
        })

        interaction.deferUpdate()

      } break

      case 'embedbuilder.body': {

        let bodyTitleComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.body.title')
        let bodyDescriptionComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.body.description')
        let bodyURLComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.body.url')
        let bodyColourComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.body.colour')

        if (!bodyTitleComponentValue.length) bodyTitleComponentValue = null
        if (!bodyDescriptionComponentValue.length) bodyDescriptionComponentValue = null
        if (!bodyURLComponentValue.length) bodyURLComponentValue = null
        if (!bodyColourComponentValue.length || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(bodyColourComponentValue)) bodyColourComponentValue = null

        if (
          bodyTitleComponentValue == null &&
          bodyDescriptionComponentValue == null &&
          bodyURLComponentValue == null &&
          interaction.message.embeds[0].image == null &&
          interaction.message.embeds[0].thumbnail == null &&
          interaction.message.embeds[0].author == null &&
          interaction.message.embeds[0].footer == null
        ) return Utils.Functions.clientError(
          interaction,
          'No can do!',
          'You cannot send an empty embed.',
          true
        )

        interaction.message.edit({
          embeds: [
            new Discord.EmbedBuilder()
              .setAuthor(interaction.message.embeds[0].author)
              .setColor(bodyColourComponentValue ? `#${bodyColourComponentValue.replace('#', '')}` : null)
              .setDescription(bodyDescriptionComponentValue)
              .setFooter(interaction.message.embeds[0].footer)
              .setImage(interaction.message.embeds[0].image?.url ?? null)
              .setThumbnail(interaction.message.embeds[0].thumbnail?.url ?? null)
              .setTitle(bodyTitleComponentValue)
              .setURL(bodyURLComponentValue)
          ]
        })

        interaction.deferUpdate()

      } break

      case 'embedbuilder.image': {

        let imageMainComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.image.main')
        let imageThumbnailComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.image.thumbnail')

        if (!imageMainComponentValue.length) imageMainComponentValue = null
        if (!imageThumbnailComponentValue.length) imageThumbnailComponentValue = null

        if (
          interaction.message.embeds[0].title == null &&
          interaction.message.embeds[0].description == null &&
          interaction.message.embeds[0].url == null &&
          imageMainComponentValue == null &&
          imageThumbnailComponentValue == null &&
          interaction.message.embeds[0].author == null &&
          interaction.message.embeds[0].footer == null
        ) return Utils.Functions.clientError(
          interaction,
          'No can do!',
          'You cannot send an empty embed.',
          true
        )

        interaction.message.edit({
          embeds: [
            new Discord.EmbedBuilder()
              .setAuthor(interaction.message.embeds[0].author)
              .setColor(`#${interaction.message.embeds[0].hexColor?.replace('#', '')}`)
              .setDescription(interaction.message.embeds[0].description)
              .setFooter(interaction.message.embeds[0].footer)
              .setImage(imageMainComponentValue)
              .setThumbnail(imageThumbnailComponentValue)
              .setTitle(interaction.message.embeds[0].title)
              .setURL(interaction.message.embeds[0].url)
          ]
        })

        interaction.deferUpdate()

      } break

      case 'embedbuilder.footer': {

        let footerTextComponentValue: string | null = interaction.fields.getTextInputValue('embedbuilder.footer.text')
        let footerIconComponentValue: string | undefined = interaction.fields.getTextInputValue('embedbuilder.footer.icon')

        if (!footerTextComponentValue.length) footerTextComponentValue = null
        if (!footerIconComponentValue.length) footerIconComponentValue = undefined

        if (
          interaction.message.embeds[0].title == null &&
          interaction.message.embeds[0].description == null &&
          interaction.message.embeds[0].url == null &&
          interaction.message.embeds[0].image == null &&
          interaction.message.embeds[0].thumbnail == null &&
          interaction.message.embeds[0].author == null &&
          footerTextComponentValue == null
        ) return Utils.Functions.clientError(
          interaction,
          'No can do!',
          'You cannot send an empty embed.',
          true
        )

        interaction.message.edit({
          embeds: [
            new Discord.EmbedBuilder()
              .setAuthor(interaction.message.embeds[0].author)
              .setColor(`#${interaction.message.embeds[0].hexColor?.replace('#', '')}`)
              .setDescription(interaction.message.embeds[0].description)
              .setFooter(footerTextComponentValue ? { text: footerTextComponentValue, iconURL: footerIconComponentValue } : null)
              .setImage(interaction.message.embeds[0].image?.url ?? null)
              .setThumbnail(interaction.message.embeds[0].thumbnail?.url ?? null)
              .setTitle(interaction.message.embeds[0].title)
              .setURL(interaction.message.embeds[0].url)
          ]
        })

        interaction.deferUpdate()

      } break

    }

  }
})