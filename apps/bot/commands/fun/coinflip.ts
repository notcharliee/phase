import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin.'),
  async execute(client, interaction) {

    interaction.reply(["It's **Tails**!", "It's **Heads**!"][Math.floor(Math.random() * 2)])

  }
})