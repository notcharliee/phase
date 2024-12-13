import { BotSubcommandBuilder } from "@phasejs/core/builders"
import { hyperlink } from "discord.js"

import { MessageBuilder } from "~/structures/builders"

export default new BotSubcommandBuilder()
  .setName("report")
  .setDescription("Reports a bug to the developers.")
  .setExecute(async (interaction) => {
    const bugReportURL = new URL("https://phasebot.xyz/contact/bug-report")

    if (interaction.guildId) {
      bugReportURL.searchParams.set("guildId", interaction.guildId)
      bugReportURL.searchParams.set("channelId", interaction.channelId)
    }

    const bugReportLink = hyperlink("Please click here", bugReportURL)

    return await interaction.reply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Bug Report")
          .setDescription(`${bugReportLink} to send your bug report.`)
          .setFooter({ text: "Thanks for taking the time to do this! 🤍" })
      }),
    )
  })
