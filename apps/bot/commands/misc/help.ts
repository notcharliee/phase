import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('Having trouble? We can help.'),
  async execute(client, interaction) {

    interaction.reply({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
          .setComponents(
            new Discord.ButtonBuilder()
              .setLabel('Modules')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Utils.Enums.PhaseURL.PhaseModules),
            new Discord.ButtonBuilder()
              .setLabel('Commands')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Utils.Enums.PhaseURL.PhaseCommands),
            new Discord.ButtonBuilder()
              .setLabel('Support')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Utils.Enums.PhaseURL.PhaseSupport)
          )
      ],
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.Enums.PhaseColour.Primary)
          .setDescription(`Having trouble with Phase? We can help!\n\n**Phase Modules**\n${Utils.Enums.PhaseURL.PhaseModules}\n\n**Phase Commands**\n${Utils.Enums.PhaseURL.PhaseCommands}\n\n**Phase Support**\n${Utils.Enums.PhaseURL.PhaseSupport}`)
          .setTitle('Help is here!')
      ],
    })

  }
})