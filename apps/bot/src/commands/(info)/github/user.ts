import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { Octokit } from "@octokit/rest"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("user")
  .setDescription("Gives you info about a GitHub user.")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("The user or organisation's username.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const octokit = new Octokit()

    const username = interaction.options.getString("username", true)

    try {
      const user = (await octokit.users.getByUsername({ username })).data

      void interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              iconURL: user.avatar_url,
              name: user.name ?? username,
            })
            .setColor(PhaseColour.Primary)
            .setDescription(
              dedent`
                ${user.bio}

                **Followers:** ${user.followers}
                **Following:** ${user.following}
                **Joined:** <t:${Math.floor(Date.parse(user.created_at) / 1000)}:R>
              `,
            )
            .setThumbnail(user.avatar_url)
            .setFooter({
              text: `ID: ${user.id}`,
            }),
        ],
      })
    } catch {
      interaction.reply(
        new BotError(
          `Could not find a user under the name \`${username}\`.`,
        ).toJSON(),
      )
    }
  })
