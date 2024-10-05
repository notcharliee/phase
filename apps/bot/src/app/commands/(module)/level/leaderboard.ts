import { AttachmentBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
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
      .setDescription("How many ranks to include (maximum of 15 at a time).")
      .setMinValue(1)
      .setMaxValue(15)
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const rankStart = interaction.options.getInteger("rank-start", true)
    const rankCount = interaction.options.getInteger("rank-count", true)
    const rankEnd = rankStart + (rankCount - 1)

    const guildDoc = interaction.client.store.guilds.get(interaction.guildId!)

    if (!guildDoc?.modules?.[ModuleId.Levels]?.enabled) {
      return void interaction.reply(
        BotErrorMessage.moduleNotEnabled(ModuleId.Levels).toJSON(),
      )
    }

    await interaction.deferReply()

    const apiResponse = await fetch(
      `https://phasebot.xyz/api/image/levels/guild.png?rankStart=${rankStart}&rankEnd=${rankEnd}&guild=${interaction.guildId}&date=${Date.now()}`,
    )

    if (apiResponse.ok) {
      const imageArrayBuffer = await apiResponse.arrayBuffer()
      const imageBuffer = Buffer.from(imageArrayBuffer)
      const imageAttachment = new AttachmentBuilder(imageBuffer)

      void interaction.editReply({
        files: [imageAttachment],
      })
    } else {
      void interaction.editReply(
        BotErrorMessage.unknown({
          error: new Error(apiResponse.statusText),
          commandName: "level leaderboard",
          channelId: interaction.channelId,
          guildId: interaction.guildId!,
        }).toJSON(),
      )
    }
  })
