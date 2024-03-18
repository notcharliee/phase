import { botCommand, BotCommandBuilder } from "phasebot"
import { EmbedBuilder } from "discord.js"

import { PhaseColour } from "~/utils"

export default botCommand(
  new BotCommandBuilder()
    .setName("ping")
    .setDescription("Calculates the current bot ping."),
  async (client, interaction) => {
    const ping = await interaction.deferReply({ fetchReply: true })
    const commandLatency = ping.createdTimestamp - interaction.createdTimestamp
    const apiLatency = client.ws.ping
    const rebootTimestamp = `<t:${Math.round(client.readyTimestamp / 1000)}:R>`

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(
            `Command Latency: ${commandLatency}ms\nDiscord API Latency: ${apiLatency}ms\n\nLast Reboot: ${rebootTimestamp}`,
          )
          .setTitle("Pong! 🏓"),
      ],
    })
  },
)
