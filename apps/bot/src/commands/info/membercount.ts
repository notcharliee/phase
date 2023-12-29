import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Displays the server member count.')
    .setDMPermission(false),
  async execute(client, interaction) {

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.PhaseColour.Primary)
          .setDescription(`This server has ${interaction.guild!.memberCount} total members.`)
          .setThumbnail(interaction.guild!.iconURL())
          .setTitle(interaction.guild!.name)
      ],
    })

  }
})