import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'


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
          .setLabel('Docs')
          .setStyle(Discord.ButtonStyle.Link)
          .setURL(Utils.PhaseURL.PhaseDocs),
          new Discord.ButtonBuilder()
          .setLabel('Support')
          .setStyle(Discord.ButtonStyle.Link)
          .setURL(Utils.PhaseURL.PhaseSupport)
        )
      ],
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Utils.PhaseColour.Primary)
        .setDescription(`Having trouble with Phase? We can help!\n\n**Documentation**\n${Utils.PhaseURL.PhaseDocs}\n\n**Support Discord**\n${Utils.PhaseURL.PhaseSupport}`)
        .setTitle('Help is here!')
      ],
    })

  }
})