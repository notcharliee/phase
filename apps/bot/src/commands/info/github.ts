import { botCommand, BotCommandBuilder } from "phase.js"
import { errorMessage, PhaseColour } from "~/utils"
import { EmbedBuilder } from "discord.js"
import { Octokit } from "@octokit/rest"

export default botCommand(
  new BotCommandBuilder()
    .setName("github")
    .setDescription("Get info from GitHub.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Get info about a GitHub user.")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The user or organisation's username.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("repo")
        .setDescription("Get info about a GitHub repository.")
        .addStringOption((option) =>
          option
            .setName("owner")
            .setDescription("The repository owner's username.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("repository")
            .setDescription("The repository name.")
            .setRequired(true),
        ),
    ),
  async (client, interaction) => {
    const octokit = new Octokit()

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
            const user = (await octokit.users.getByUsername({ username })).data

            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    iconURL: user.avatar_url,
                    name: user.name ?? username,
                  })
                  .setColor(PhaseColour.Primary)
                  .setDescription(
                    `${user.bio}\n\n**Followers:** ${user.followers}\n**Following:** ${user.following}\n**Joined:** <t:${Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / 1000)}:R>`,
                  )
                  .setThumbnail(user.avatar_url)
                  .setFooter({
                    text: `ID: ${user.id}`,
                  }),
              ],
            })
          } catch {
            interaction.reply(
              errorMessage({
                title: "User Not Found",
                description: `Could not find a user under the name \`${username}\`.`,
              }),
            )
          }
        }
        break

      case "repo":
        {
          const owner = interaction.options.getString("owner", true)
          const repository = interaction.options.getString("repository", true)

          try {
            const repo = (await octokit.repos.get({ owner, repo: repository }))
              .data

            interaction.reply({
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
                    `${repo.description}\n\n**Language:** ${repo.language ?? "None"}\n**Issues:** ${repo.open_issues}\n**Forks:** ${repo.forks}\n**Stars:** ${repo.stargazers_count}\n**License:** ${repo.license ? repo.license.name : "None"}\n**Created:** <t:${Math.floor((new Date().getTime() - new Date(repo.created_at).getTime()) / 1000)}:R>`,
                  )
                  .setFooter({
                    text: `ID: ${repo.id}`,
                  }),
              ],
            })
          } catch {
            interaction.reply(
              errorMessage({
                title: "Repository Not Found",
                description: `Could not find a repository under the name \`${owner}/${repository}\`.`,
              }),
            )
          }
        }
        break

      default: {
        interaction.reply({
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
