import { AttachmentBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

const API_URL = new URL("https://random.dog")

export default new BotCommandBuilder()
  .setName("dog")
  .setDescription("Gives you a random picture of a dog.")
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    try {
      API_URL.pathname = "/woof"

      const imageURLResponse = await fetch(API_URL.toString())
      const imageURL = await imageURLResponse.text()

      API_URL.pathname = "/" + imageURL

      const imageResponse = await fetch(API_URL.toString())
      const imageArrayBuffer = await imageResponse.arrayBuffer()
      const imageBuffer = Buffer.from(imageArrayBuffer)

      const attachment = new AttachmentBuilder(imageBuffer)
        .setName("random-dog.png")
        .setDescription("Random dog image")

      return void interaction.editReply(
        new MessageBuilder().setFiles(attachment).setEmbeds((embed) => {
          return embed
            .setTitle("Random Dog")
            .setColor("Primary")
            .setImage(attachment)
            .setFooter({ text: `Made with ${API_URL.hostname} 🤍` })
        }),
      )
    } catch {
      return void interaction.editReply(
        new BotErrorMessage("Failed to fetch a dog image."),
      )
    }
  })
