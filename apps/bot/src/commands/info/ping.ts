import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Calculates the current bot latency metrics.'),
  async execute(client, interaction) {

    const ping = await interaction.deferReply({ fetchReply: true })

    const commandLatency = ping.createdTimestamp - interaction.createdTimestamp
    const apiLatency = client.ws.ping
    const rebootTimestamp = `<t:${Math.round(client.readyTimestamp / 1000)}:R>`

    interaction.editReply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.PhaseColour.Primary)
          .setDescription(`Command Latency: ${commandLatency}ms\nDiscord API Latency: ${apiLatency}ms\n\nLast Reboot: ${rebootTimestamp}`)
          .setTitle('Pong! 🏓')
      ],
    })

  }
})