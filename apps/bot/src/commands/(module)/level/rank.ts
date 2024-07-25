import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

import { generateRankCard } from "~/images/rank"

export default new BotSubcommandBuilder()
  .setName("rank")
  .setDescription("Generates your server rank card.")
  .addUserOption((option) =>
    option.setName("user").setDescription("Specify a user.").setRequired(false),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const user = interaction.options.getUser("user", false) ?? interaction.user

    try {
      const guildDoc = await db.guilds.findOne({
        id: interaction.guildId!,
      })

      if (!guildDoc?.modules?.Levels?.enabled) {
        void interaction.reply(BotError.moduleNotEnabled("Levels").toJSON())
        return
      }

      await interaction.deferReply()

      const userLevelData = (await (db.levels.findOne({
        guild: interaction.guildId!,
        user: user.id,
      }) ??
        db.levels.create({
          guild: interaction.guildId,
          user: user.id,
          level: 0,
          xp: 0,
        })))!

      const userRank =
        (await db.levels.countDocuments({
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

      const rankCard = await generateRankCard({
        background: guildDoc.modules.Levels.background,
        rank: userRank.toString(),
        level: userLevelData.level.toString(),
        xp: userLevelData.xp.toString(),
        target: `${500 * (userLevelData.level + 1)}`,
        username: user.username,
        avatar: user.displayAvatarURL({ extension: "png", size: 128 }),
      }).toAttachment()

      void interaction.editReply({
        files: [rankCard],
      })
    } catch (error) {
      console.error(error)

      void interaction.editReply(
        BotError.unknown({
          error: error as Error,
          commandName: "level rank",
          channelId: interaction.channelId,
          guildId: interaction.guildId!,
        }).toJSON(),
      )
    }
  })
