import { BotSubcommandBuilder } from "@phasejs/core/builders"
import { userMention } from "discord.js"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders"

export default new BotSubcommandBuilder()
  .setName("list")
  .setDescription("Lists the members that have dashboard access.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const guild = interaction.guild!
    const guildDoc = interaction.client.stores.guilds.get(guild.id)!

    if (guild.ownerId !== interaction.user.id) {
      const errorMessage = BotErrorMessage.userNotOwner()
      return await interaction.reply(errorMessage)
    }

    return await interaction.reply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setTitle("Dashboard Admins")
          .setColor("Primary")
          .setDescription(
            guildDoc.admins
              .map((adminId, index) => `${index + 1}. ${userMention(adminId)}`)
              .join("\n"),
          )
      }),
    )
  })
