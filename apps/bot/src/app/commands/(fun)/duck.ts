import { AttachmentBuilder } from "discord.js"
import { BotCommandBuilder } from "@phasejs/core/builders"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

const API_URL = new URL("https://random-d.uk/api/randomimg")

export default new BotCommandBuilder()
  .setName("duck")
  .setDescription("Gives you a random picture of a duck.")
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    try {
      const response = await fetch(API_URL.toString())
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const attachment = new AttachmentBuilder(buffer)
        .setName("random-duck.png")
        .setDescription("Random duck image")

      return void interaction.editReply(
        new MessageBuilder().setFiles(attachment).setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setTitle("Random Duck")
            .setImage(attachment)
            .setFooter({ text: `Made with ${API_URL.hostname} 🤍` })
        }),
      )
    } catch {
      return void interaction.editReply(
        new BotErrorMessage("Failed to fetch a duck image."),
      )
    }
  })
