import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
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
              .setURL(Utils.PhaseURL.PhaseModules),
            new Discord.ButtonBuilder()
              .setLabel('Commands')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Utils.PhaseURL.PhaseCommands),
            new Discord.ButtonBuilder()
              .setLabel('Support')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Utils.PhaseURL.PhaseSupport)
          )
      ],
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.PhaseColour.Primary)
          .setDescription(`Having trouble with Phase? We can help!\n\n**Phase Modules**\n${Utils.PhaseURL.PhaseModules}\n\n**Phase Commands**\n${Utils.PhaseURL.PhaseCommands}\n\n**Phase Support**\n${Utils.PhaseURL.PhaseSupport}`)
          .setTitle('Help is here!')
      ],
    })

  }
})