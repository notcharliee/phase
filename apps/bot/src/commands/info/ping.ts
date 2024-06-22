import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/utils"

export default new BotCommandBuilder()
  .setName("ping")
  .setDescription("Calculates the current bot ping.")
  .setExecute(async (interaction) => {
    const ping = await interaction.deferReply({ fetchReply: true })
    const commandLatency = ping.createdTimestamp - interaction.createdTimestamp
    const apiLatency = interaction.client.ws.ping
    const rebootTimestamp = `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:R>`

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Pong! 🏓")
          .setDescription(
            `Command Latency: ${commandLatency}ms\nDiscord API Latency: ${apiLatency}ms\n\nLast Reboot: ${rebootTimestamp}`,
          ),
      ],
    })
  })
