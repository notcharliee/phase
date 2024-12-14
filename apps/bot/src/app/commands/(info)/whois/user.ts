import { BotSubcommandBuilder } from "@phasejs/core/builders"
import { EmbedBuilder } from "discord.js"

import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"

export default new BotSubcommandBuilder()
  .setName("user")
  .setDescription("Gives you info about a user.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user you want to select (accepts IDs).")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const user = await interaction.options.getUser("user", true).fetch()

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(user.hexAccentColor ?? PhaseColour.Primary)
          .setThumbnail(user.displayAvatarURL())
          .setDescription(
            dedent`
              **Username:** ${user.username}
              **Display Name:** ${user.displayName}
              **Registered:** <t:${Math.floor(user.createdAt.getTime() / 1000)}:R>
              **Banner ${user.banner ? "URL" : "Colour"}:** ${user.banner ? `[Click here](${user.bannerURL()})` : (user.hexAccentColor ?? "None")}
            `,
          )
          .setFooter({ text: `ID: ${user.id}` })
          .setTimestamp(),
      ],
    })
  })
