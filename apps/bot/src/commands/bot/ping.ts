import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"

export default new BotSubcommandBuilder()
  .setName("ping")
  .setDescription("Calculates the current bot latency.")
  .setExecute(async (interaction) => {
    const defferedReply = await interaction.deferReply({
      fetchReply: true,
    })

    const commandLatency =
      defferedReply.createdTimestamp - interaction.createdTimestamp
    const apiLatency = interaction.client.ws.ping
    const rebootTimestamp = `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:R>`

    void interaction.editReply({
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
