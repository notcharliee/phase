import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { PhaseColour } from "~/lib/enums"

export default new BotSubcommandBuilder()
  .setName("invite")
  .setDescription("Generates an invite link for the bot.")
  .setExecute(async (interaction) => {
    const inviteUrl = (
      await fetch("https://phasebot.xyz/redirect/invite", {
        redirect: "manual",
      })
    ).headers.get("Location")!

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Invite Link")
          .setDescription(
            `[Click here](${inviteUrl}) to invite the bot to your server.`,
          )
          .setFooter({ text: "Thanks for using Phase! 🤍" }),
      ],
    })
  })
