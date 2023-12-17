import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play a game of rock-paper-scissors.')
    .addStringOption(
      new Discord.SlashCommandStringOption()
      .setName('choice')
      .setDescription('Your move.')
      .setRequired(true)
      .setChoices(
        { name: 'Rock', value: 'rock' },
        { name: 'Paper', value: 'paper' },
        { name: 'Scissors', value: 'scissors' },
      )
    ),
  async execute(client, interaction) {
    
    const choices = ['rock', 'paper', 'scissors']
    const outcomes = [ `It's a tie! GG. 🤝`, `You win! GG. 🤝`, `I win! GG. 🤝` ]
    const choice = interaction.options.getString('choice', true)
    const move = Math.floor(Math.random() * 3)
    const outcomeIndex = (choices.indexOf(choice) - move + 3) % 3

    interaction.reply(`You chose **${choice}** and I chose **${choices[move]}**.\n${outcomes[outcomeIndex]}`)
    
  }
})