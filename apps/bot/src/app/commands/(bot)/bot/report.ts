import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { PhaseColour } from "~/lib/enums"

export default new BotSubcommandBuilder()
  .setName("report")
  .setDescription("Reports a bug to the developers.")
  .setExecute(async (interaction) => {
    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Bug Report")
          .setDescription(
            `[Click here](https://phasebot.xyz/contact/bug-report) to send a bug report to the developers.`,
          )
          .setFooter({
            text: "Thanks for taking the time to do this! 🤍",
          }),
      ],
    })
  })