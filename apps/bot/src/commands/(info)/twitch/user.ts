import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { twitchAPI } from "~/lib/clients/twitch"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("user")
  .setDescription("Gives you info about a Twitch user.")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("The user's username.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const username = interaction.options.getString("username", true)
    const user = await twitchAPI.users.getUserByName(username).catch(() => null)

    if (!user) {
      void interaction.editReply(
        new BotError(
          `Could not find a user under the name \`${username}\`.`,
        ).toJSON(),
      )

      return
    }

    const live = await user.getStream().catch(() => null)

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            iconURL: user.profilePictureUrl,
            name: user.displayName,
          })
          .setColor(PhaseColour.Primary)
          .setDescription(user.description.length > 0 ? user.description : null)
          .setFields([
            {
              name: "Status",
              value: live
                ? "`[Live](https://twitch.tv/${user.name})`"
                : "Offline",
              inline: true,
            },
            {
              name: "Created",
              value: `<t:${Math.floor(user.creationDate.getTime() / 1000)}:R>`,
              inline: true,
            },
            {
              name: "User ID",
              value: user.id,
              inline: true,
            },
          ])
          .setImage(
            user.offlinePlaceholderUrl.length > 0
              ? user.offlinePlaceholderUrl
              : null,
          ),
      ],
    })
  })
