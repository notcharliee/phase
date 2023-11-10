import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('echo')
    .setDescription('Echoes the text you give it.')
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('text')
        .setDescription('The text to echo.')
        .setRequired(true)
    ),
  async execute(client, interaction) {

    interaction.reply(interaction.options.getString('text', true))

  }
})