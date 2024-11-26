import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"

import { generateLeaderboardCard } from "~/images/leaderboard"
import { BotErrorMessage } from "~/structures/BotError"

import type { LeaderboardUser } from "~/images/leaderboard"

export default new BotSubcommandBuilder()
  .setName("leaderboard")
  .setDescription("Generates the server level leaderboard.")
  .addIntegerOption((option) => {
    return option
      .setName("start")
      .setDescription("Specify a rank to start from.")
      .setMinValue(1)
      .setRequired(false)
  })
  .addIntegerOption((option) => {
    return option
      .setName("count")
      .setDescription("Specify the number of ranks to display.")
      .setMinValue(1)
      .setMaxValue(15)
      .setRequired(false)
  })
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)
    const moduleConfig = guildDoc?.modules?.[ModuleId.Levels]

    if (!moduleConfig) {
      const message = BotErrorMessage.moduleNotEnabled(ModuleId.Levels)
      return void interaction.reply(message)
    }

    await interaction.deferReply()

    const rankCount = interaction.options.getInteger("count") ?? 5
    const rankStart = interaction.options.getInteger("start") ?? 1
    const rankEnd = rankStart + (rankCount - 1)

    try {
      const usersData = await db.levels
        .find({ guild: interaction.guildId })
        .sort({ level: -1, xp: -1 })
        .skip(rankStart - 1)
        .limit(rankEnd - rankStart + 1)

      const users: LeaderboardUser[] = []

      for (let index = 0; index < usersData.length; index++) {
        const data = usersData[index]!

        try {
          const user =
            interaction.client.users.resolve(data.user) ??
            (await interaction.client.users.fetch(data.user))

          users.push({
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.displayAvatarURL({ size: 64, extension: "png" }),
            level: data.level,
            xp: data.xp,
            rank: rankStart + index,
            target: 500 * (data.level + 1),
          })
        } catch {
          continue
        }
      }

      if (!users.length) {
        return void interaction.editReply(
          "No users found within the specified rank range.",
        )
      }

      const leaderboard = await generateLeaderboardCard(users)
      const leaderboardAttachment = leaderboard.toAttachment()

      await interaction.editReply({ files: [leaderboardAttachment] })
    } catch (error) {
      console.error(`[Levels] Failed to generate leaderboard:`)
      console.error(error)

      void interaction.editReply(
        BotErrorMessage.unknown({
          error: error as Error,
          commandName: "level leaderboard",
          channelId: interaction.channelId,
          guildId: interaction.guildId!,
        }).toJSON(),
      )
    }
  })
