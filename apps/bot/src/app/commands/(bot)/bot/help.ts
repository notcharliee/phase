import { BotSubcommandBuilder } from "@phasejs/builders"
import { ButtonStyle } from "discord.js"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

export default new BotSubcommandBuilder()
  .setName("help")
  .setDescription("Links to the bot's docs and support discord.")
  .setExecute(async (interaction) => {
    return void interaction.reply(
      new MessageBuilder()
        .setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setTitle("Help")
            .setDescription(
              "You can read our docs or ask the team directly using the buttons below!",
            )
        })
        .setComponents((actionrow) => {
          return actionrow
            .addButton((button) => {
              return button
                .setLabel("Documentation")
                .setURL("https://phasebot.xyz/docs")
                .setStyle(ButtonStyle.Link)
            })
            .addButton((button) => {
              return button
                .setLabel("Support Discord")
                .setURL("https://discord.gg/338tyqeg82")
                .setStyle(ButtonStyle.Link)
            })
        }),
    )
  })
