import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('embed')
    .setDescription('Opens the Phase Embed Builder.'),
  async execute(client, interaction) {

    interaction.reply({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
          .setComponents(
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.author')
              .setLabel('Edit Author')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.body')
              .setLabel('Edit Body')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.image')
              .setLabel('Edit Image')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.footer')
              .setLabel('Edit Footer')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.send')
              .setLabel('Send Embed')
              .setStyle(Discord.ButtonStyle.Success),
          )
      ],
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.PhaseColour.Primary)
          .setDescription('Use the buttons below to edit this embed, then hit Send Embed when finished.')
          .setTitle('Embed Builder')
      ],
    })

  }
})