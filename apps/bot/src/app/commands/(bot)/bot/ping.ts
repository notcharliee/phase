import { BotSubcommandBuilder } from "@phasejs/builders"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

export default new BotSubcommandBuilder()
  .setName("ping")
  .setDescription("Calculates the current bot latency.")
  .setExecute(async (interaction) => {
    const reply = await interaction.deferReply({
      fetchReply: true,
    })

    const commandLatency = reply.createdTimestamp - interaction.createdTimestamp
    const apiLatency = interaction.client.ws.ping
    const rebootTimestamp = `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:R>`

    await interaction.editReply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed.setColor("Primary").setTitle("Pong! 🏓").setDescription(`
          Command Latency: ${commandLatency}ms
          Discord API Latency: ${apiLatency}ms
          
          Last Reboot: ${rebootTimestamp}
        `)
      }),
    )
  })
