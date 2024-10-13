import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("list")
  .setDescription("Lists the members that have dashboard access.")
  .setExecute(async (interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    })

    if (!interaction.guild) {
      void interaction.editReply(BotErrorMessage.serverOnlyCommand().toJSON())
      return
    }

    if (interaction.guild.ownerId !== interaction.user.id) {
      void interaction.editReply(BotErrorMessage.userNotOwner().toJSON())

      return
    }

    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)!

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Dashboard Admins")
          .setDescription(
            guildDoc.admins
              .map((adminId, index) => `${index + 1}. <@!${adminId}>`)
              .join("\n"),
          )
          .setColor(PhaseColour.Primary),
      ],
    })
  })
