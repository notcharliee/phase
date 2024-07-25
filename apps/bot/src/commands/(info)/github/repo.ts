import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { Octokit } from "@octokit/rest"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("repo")
  .setDescription("Gives you info about a GitHub repository.")
  .addStringOption((option) =>
    option
      .setName("owner")
      .setDescription("The owner's username.")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("repository")
      .setDescription("The repository name.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const octokit = new Octokit()

    const owner = interaction.options.getString("owner", true)
    const repository = interaction.options.getString("repository", true)

    try {
      const repo = (await octokit.repos.get({ owner, repo: repository })).data

      void interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              iconURL: repo.owner.avatar_url,
              name: repo.full_name,
            })
            .setColor(PhaseColour.Primary)
            .setTitle(repo.name)
            .setURL(repo.html_url)
            .setDescription(
              dedent`
                ${repo.description}

                **Language:** ${repo.language ?? "None"}
                **Issues:** ${repo.open_issues}
                **Forks:** ${repo.forks}
                **Stars:** ${repo.stargazers_count}
                **License:** ${repo.license ? repo.license.name : "None"}
                **Created:** <t:${Math.floor(Date.parse(repo.created_at) / 1000)}:R>
              `,
            )
            .setFooter({
              text: `ID: ${repo.id}`,
            }),
        ],
      })
    } catch {
      interaction.reply(
        new BotError(
          `Could not find a repository under the name \`${owner}/${repository}\`.`,
        ).toJSON(),
      )
    }
  })
