import { GuildSchema, LevelSchema } from "@repo/schemas"
import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { BotCommandBuilder, botCommand } from "phasebot"
import { PhaseColour, errorMessage, moduleNotEnabled } from "~/utils"

export default botCommand(
  new BotCommandBuilder()
    .setName("level")
    .setDescription("level")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rank")
        .setDescription("Generates your server rank card.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Specify a user.")
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leaderboard")
        .setDescription("Generates the server level leaderboard.")
        .addIntegerOption((option) =>
          option
            .setName("rank-start")
            .setDescription("What rank to start from.")
            .setMinValue(1)
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("rank-count")
            .setDescription(
              "How many ranks to include (maximum of 15 at a time).",
            )
            .setMinValue(1)
            .setMaxValue(15)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Sets a users rank data.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Specify a user.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription("Set a new level rank for the user.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("xp")
            .setDescription("Set a new xp rank for the user.")
            .setRequired(true),
        ),
    ),
  async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "rank":
        {
          await interaction.deferReply()

          const user =
            interaction.options.getUser("user", false) ?? interaction.user

          const username = user.username
          const avatar = user.displayAvatarURL({ extension: "png", size: 128 })

          try {
            const guildSchema = await GuildSchema.findOne({
              id: interaction.guildId,
            })

            if (!guildSchema?.modules?.Levels?.enabled) {
              return interaction.editReply(moduleNotEnabled("Levels"))
            }

            const background = guildSchema.modules.Levels.background

            const userLevelData =
              (await LevelSchema.findOne({
                guild: interaction.guildId,
                user: user.id,
              })) ??
              (await new LevelSchema({
                guild: interaction.guildId,
                user: user.id,
                level: 0,
                xp: 0,
              }).save())

            const userRank =
              (await LevelSchema.countDocuments({
                $or: [
                  {
                    guild: userLevelData.guild,
                    level: { $gt: userLevelData.level },
                  },
                  {
                    guild: userLevelData.guild,
                    level: userLevelData.level,
                    xp: { $gt: userLevelData.xp },
                  },
                ],
              })) + 1

            const rank = userRank.toString()
            const level = userLevelData.level.toString()
            const xp = userLevelData.xp.toString()
            const target = `${500 * (userLevelData.level + 1)}`

            const rankCardUrl = new URL(
              `https://phasebot.xyz/api/image/rank.png`,
            )

            if (background) {
              rankCardUrl.searchParams.append("background", background)
            }

            rankCardUrl.searchParams.append("username", username)
            rankCardUrl.searchParams.append("avatar", avatar)
            rankCardUrl.searchParams.append("rank", rank)
            rankCardUrl.searchParams.append("level", level)
            rankCardUrl.searchParams.append("xp", xp)
            rankCardUrl.searchParams.append("target", target)

            const rankCard = new AttachmentBuilder(
              Buffer.from(
                await fetch(rankCardUrl.toString()).then((res) =>
                  res.arrayBuffer(),
                ),
              ),
            )

            interaction.editReply({
              files: [rankCard],
            })
          } catch (error) {
            console.error(error)

            interaction.editReply(
              errorMessage({
                title: "An error occurred.",
                description:
                  "An error occurred while processing your request. Please try again later.",
              }),
            )
          }
        }
        break

      case "leaderboard":
        {
          await interaction.deferReply()

          const rankStart = interaction.options.getInteger("rank-start", true)
          const rankCount = interaction.options.getInteger("rank-count", true)
          const rankEnd = rankStart + (rankCount - 1)

          const apiResponse = await fetch(
            `https://phasebot.xyz/api/image/levels/guild.png?rankStart=${rankStart}&rankEnd=${rankEnd}&guild=${interaction.guildId}&date=${Date.now()}`,
          )

          if (apiResponse.ok) {
            const imageArrayBuffer = await apiResponse.arrayBuffer()
            const imageBuffer = Buffer.from(imageArrayBuffer)
            const imageAttachment = new AttachmentBuilder(imageBuffer)

            interaction.editReply({
              files: [imageAttachment],
            })
          } else {
            return interaction.editReply(moduleNotEnabled("Tickets"))
          }
        }
        break

      case "set":
        {
          const user = interaction.options.getUser("user", true)
          const level = interaction.options.getInteger("level", true)
          const xp = interaction.options.getInteger("xp", true)

          const guildSchema = await GuildSchema.findOne({
            id: interaction.guildId,
          })
          const levelSchema = await LevelSchema.findOne({
            guild: interaction.guildId,
            user: user.id,
          })

          if (!guildSchema?.modules?.Levels?.enabled)
            interaction.reply(moduleNotEnabled("Tickets"))

          if (!levelSchema)
            new LevelSchema({
              guild: interaction.guildId,
              user: user.id,
              level: level,
              xp: level,
            }).save()
          else {
            levelSchema.level = level
            levelSchema.xp = xp
            levelSchema.save()
          }

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription("Level data was updated successfully.")
                .setTitle("Level Data Set"),
            ],
          })
        }
        break
    }
  },
)
