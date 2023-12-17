import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin.'),
  async execute(client, interaction) {

    interaction.reply(["It's **Tails**!", "It's **Heads**!"][Math.floor(Math.random() * 2)])

  }
})