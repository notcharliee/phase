import * as Discord from 'discord.js'
import * as Utils from 'phaseutils'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Displays the server member count.')
    .setDMPermission(false),
  async execute(client, interaction) {

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.Enums.PhaseColour.Primary)
          .setDescription(`This server has ${interaction.guild!.memberCount} total members.`)
          .setThumbnail(interaction.guild!.iconURL())
          .setTitle(interaction.guild!.name)
      ],
    })

  }
})