import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'


export default Utils.Functions.clientButtonEvent({
  customId: /embedbuilder\.(author|body|image|footer|send)/,
  async execute(client, interaction) {

    if (interaction.user.id != interaction.message.interaction?.user.id) return Utils.Functions.clientError(
      interaction,
      'Access Denied!',
      Utils.Enums.PhaseError.AccessDenied,
      true
    )

    switch (interaction.customId) {

      case 'embedbuilder.author': {

        const authorTextComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.author.name')
          .setLabel('Author Name')
          .setMaxLength(256)
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].author?.name) authorTextComponent.setValue(interaction.message.embeds[0].author.name)

        const authorURLComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.author.url')
          .setLabel('Author URL')
          .setPlaceholder('https://phasebot.xyz')
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].author?.url) authorURLComponent.setValue(interaction.message.embeds[0].author.url)

        const authorIconComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.author.icon')
          .setLabel('Author Icon URL')
          .setPlaceholder('https://phasebot.xyz/phase.png')
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].author?.iconURL) authorIconComponent.setValue(interaction.message.embeds[0].author.iconURL)


        const modalAuthorText = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(authorTextComponent)
        const modalAuthorURL = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(authorURLComponent)
        const modalAuthorIcon = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(authorIconComponent)

        const modal = new Discord.ModalBuilder()
          .addComponents(modalAuthorText, modalAuthorURL, modalAuthorIcon)
          .setCustomId(`embedbuilder.author`)
          .setTitle('Embed Builder')

        const showModal = await interaction.showModal(modal)
        Promise.resolve(showModal)

      } break

      case 'embedbuilder.body': {

        const bodyTitleComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.body.title')
          .setLabel('Body Title')
          .setMaxLength(256)
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].title) bodyTitleComponent.setValue(interaction.message.embeds[0].title)

        const bodyDescriptionComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.body.description')
          .setLabel('Body Description')
          .setMaxLength(4000)
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Paragraph)

        if (interaction.message.embeds[0].description) bodyDescriptionComponent.setValue(interaction.message.embeds[0].description)

        const bodyURLComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.body.url')
          .setLabel('Body URL')
          .setPlaceholder('https://phasebot.xyz')
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].url) bodyURLComponent.setValue(interaction.message.embeds[0].url)

        const bodyColourComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.body.colour')
          .setLabel('Body Colour')
          .setMaxLength(7)
          .setMinLength(7)
          .setPlaceholder('#RRGGBB')
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].hexColor) bodyColourComponent.setValue(interaction.message.embeds[0].hexColor)


        const modalBodyTitle = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(bodyTitleComponent)
        const modalBodyDescription = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(bodyDescriptionComponent)
        const modalBodyURL = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(bodyURLComponent)
        const modalBodyColour = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(bodyColourComponent)

        const modal = new Discord.ModalBuilder()
          .addComponents(modalBodyTitle, modalBodyDescription, modalBodyURL, modalBodyColour)
          .setCustomId(`embedbuilder.body`)
          .setTitle('Embed Builder')

        const showModal = await interaction.showModal(modal)
        Promise.resolve(showModal)

      } break

      case 'embedbuilder.image': {

        const imageMainComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.image.main')
          .setLabel('Image URL')
          .setPlaceholder('https://phasebot.xyz/phase.png')
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].image) imageMainComponent.setValue(interaction.message.embeds[0].image.url)

        const imageThumbnailComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.image.thumbnail')
          .setLabel('Thumbnail URL')
          .setPlaceholder('https://phasebot.xyz')
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].thumbnail) imageThumbnailComponent.setValue(interaction.message.embeds[0].thumbnail.url)


        const modalImageMain = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(imageMainComponent)
        const modalImageThumbnail = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(imageThumbnailComponent)

        const modal = new Discord.ModalBuilder()
          .addComponents(modalImageMain, modalImageThumbnail)
          .setCustomId(`embedbuilder.image`)
          .setTitle('Embed Builder')

        const showModal = await interaction.showModal(modal)
        Promise.resolve(showModal)

      } break

      case 'embedbuilder.footer': {

        const footerTextComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.footer.text')
          .setLabel('Footer Text')
          .setMaxLength(256)
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].footer?.text) footerTextComponent.setValue(interaction.message.embeds[0].footer.text)

        const footerIconComponent = new Discord.TextInputBuilder()
          .setCustomId('embedbuilder.footer.icon')
          .setLabel('Footer Icon URL')
          .setPlaceholder('https://phasebot.xyz/phase.png')
          .setRequired(false)
          .setStyle(Discord.TextInputStyle.Short)

        if (interaction.message.embeds[0].footer?.iconURL) footerIconComponent.setValue(interaction.message.embeds[0].footer.iconURL)


        const modalFooterText = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(footerTextComponent)
        const modalFooterIcon = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().setComponents(footerIconComponent)

        const modal = new Discord.ModalBuilder()
          .addComponents(modalFooterText, modalFooterIcon)
          .setCustomId(`embedbuilder.footer`)
          .setTitle('Embed Builder')

        const showModal = await interaction.showModal(modal)
        Promise.resolve(showModal)

      } break

      case 'embedbuilder.send': {

        interaction.channel?.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setAuthor(interaction.message.embeds[0].author)
              .setColor(`#${interaction.message.embeds[0].hexColor?.replace('#', '')}`)
              .setDescription(interaction.message.embeds[0].description)
              .setFooter(interaction.message.embeds[0].footer)
              .setImage(interaction.message.embeds[0].image?.url ?? null)
              .setThumbnail(interaction.message.embeds[0].thumbnail?.url ?? null)
              .setTitle(interaction.message.embeds[0].title)
              .setURL(interaction.message.embeds[0].url)
          ],
        })

        await interaction.message.delete()

      } break

    }

  }
})