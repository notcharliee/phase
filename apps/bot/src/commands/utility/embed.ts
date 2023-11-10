import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientSlashCommand({
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
          .setColor(Utils.Enums.PhaseColour.Primary)
          .setDescription('Use the buttons below to edit this embed, then hit Send Embed when finished.')
          .setTitle('Embed Builder')
      ],
    })

  }
})