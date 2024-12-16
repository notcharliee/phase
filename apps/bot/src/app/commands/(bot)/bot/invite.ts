import { BotSubcommandBuilder } from "@phasejs/builders"
import { hyperlink } from "discord.js"

import { MessageBuilder } from "~/structures/builders"

export default new BotSubcommandBuilder()
  .setName("invite")
  .setDescription("Generates an invite link for the bot.")
  .setExecute(async (interaction) => {
    const inviteUrl = await fetchBotInviteLink()
    const inviteLink = hyperlink("Click here to invite the bot!", inviteUrl)

    return await interaction.reply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Invite Link")
          .setDescription(inviteLink)
          .setFooter({ text: "Thanks for using Phase! 🤍" })
      }),
    )
  })

/**
 * Fetches the latest invite link from the bot's redirect page.
 *
 * @remarks By sending the actual invite link, discord will open an in-app modal
 * instead of opening a new browser window.
 */
async function fetchBotInviteLink() {
  const url = "https://phasebot.xyz/redirect/invite"
  const response = await fetch(url, { redirect: "manual" })
  const location = response.headers.get("Location")
  return location!
}
