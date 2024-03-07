import { botCommand, BotCommandBuilder } from "phase.js"

import { AppTokenAuthProvider } from "@twurple/auth"
import { ApiClient } from "@twurple/api"

import { errorMessage, PhaseColour } from "~/utils"
import { env } from "~/env"

import { EmbedBuilder } from "discord.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("twitch")
    .setDescription("Get info from Twitch.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Get info about a Twitch user.")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The user's username.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stream")
        .setDescription("Get info about a Twitch stream.")
        .addStringOption((option) =>
          option
            .setName("user")
            .setDescription("The streamer's username.")
            .setRequired(true),
        ),
    ),
  async (client, interaction) => {
    await interaction.deferReply()

    const twitchAPI = new ApiClient({
      authProvider: new AppTokenAuthProvider(
        env.TWITCH_CLIENT_ID,
        env.TWITCH_CLIENT_SECRET,
      ),
    })

    switch (
      [
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(true),
      ]
        .join(" ")
        .trim()
    ) {
      case "user":
        {
          const username = interaction.options.getString("username", true)

          try {
            const user = await twitchAPI.users.getUserByName(username)
            if (!user) throw new Error("User not found.")

            const live = await user.getStream().catch(() => null)

            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    iconURL: user.profilePictureUrl,
                    name: user.displayName,
                  })
                  .setColor(PhaseColour.Primary)
                  .setDescription(
                    user.description.length > 0 ? user.description : null,
                  )
                  .setFields([
                    {
                      name: "Status",
                      value: live
                        ? `**[Live](https://twitch.tv/${user.name})**`
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
                  .setImage(user.offlinePlaceholderUrl.length > 0 ? user.offlinePlaceholderUrl : null)
              ],
            })
          } catch {
            interaction.editReply(
              errorMessage({
                title: "User Not Found",
                description: `Could not find a user under the name \`${username}\`.`,
              }),
            )
          }
        }
        break

      case "stream":
        {
          const username = interaction.options.getString("user", true)

          try {
            const user = await twitchAPI.users.getUserByName(username)
            if (!user) throw new Error("User not found.")

            const stream = await user.getStream().catch(() => null)

            if (!stream) {
              interaction.editReply(
                errorMessage({
                  title: "User Not Streaming",
                  description: `The user \`${username}\` is not currently streaming.`,
                }),
              )
              return
            }

            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    iconURL: user.profilePictureUrl,
                    name: user.name ?? username,
                  })
                  .setColor(PhaseColour.Primary)
                  .setTitle(stream.title)
                  .setURL(`https://twitch.tv/${user.name}`)
                  .setFields([
                    {
                      name: "Game",
                      value: stream.gameName,
                      inline: true,
                    },
                    {
                      name: "Viewers",
                      value: stream.viewers.toLocaleString(),
                      inline: true,
                    },
                    {
                      name: "Started",
                      value: `<t:${Math.floor(stream.startDate.getTime() / 1000)}:R>`,
                      inline: true,
                    },
                  ])
                  .setImage(stream.getThumbnailUrl(400, 225))
                  .setTimestamp(stream.startDate)
                  .setFooter({
                    text: `Stream ID: ${stream.id}`,
                  }),
              ],
            })
          } catch {
            interaction.editReply(
              errorMessage({
                title: "User Not Found",
                description: `Could not find a user under the name \`${username}\`.`,
              }),
            )
          }
        }
        break

      default: {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Coming Soon!")
              .setDescription("This feature is still being worked on.")
              .setColor(PhaseColour.Primary),
          ],
        })
      }
    }
  },
)
