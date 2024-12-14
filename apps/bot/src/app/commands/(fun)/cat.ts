import { BotCommandBuilder } from "@phasejs/core/builders"
import { AttachmentBuilder } from "discord.js"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

const API_URL = new URL("https://cataas.com/cat")

export default new BotCommandBuilder()
  .setName("cat")
  .setDescription("Gives you a random picture of a cat.")
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    try {
      const response = await fetch(API_URL.toString())
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const attachment = new AttachmentBuilder(buffer)
        .setName("random-cat.png")
        .setDescription("Random cat image")

      return void interaction.editReply(
        new MessageBuilder().setFiles(attachment).setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setTitle("Random Cat")
            .setImage(attachment)
            .setFooter({ text: `Made with ${API_URL.hostname} 🤍` })
        }),
      )
    } catch {
      return void interaction.editReply(
        new BotErrorMessage("Failed to fetch a cat image."),
      )
    }
  })
