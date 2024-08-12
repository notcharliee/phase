import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
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

    const guildDoc = await cache.guilds.get(interaction.guildId!)

    if (!guildDoc?.modules?.[ModuleId.Levels]?.enabled) {
      return void interaction.reply(
        BotError.moduleNotEnabled(ModuleId.Levels).toJSON(),
      )
    }

    try {
      await interaction.deferReply()

      const userLevelData =
        (await db.levels.findOne({
          guild: interaction.guildId!,
          user: user.id,
        })) ??
        (await db.levels.create({
          guild: interaction.guildId,
          user: user.id,
          level: 0,
          xp: 0,
        }))

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

      const bannerImage =
        (guildDoc.modules[ModuleId.Levels].background
          ? await fetch(guildDoc.modules[ModuleId.Levels].background)
              .catch(() => undefined)
              .then((res) =>
                res?.headers.get("content-type")?.startsWith("image")
                  ? res
                      .arrayBuffer()
                      .catch(() => undefined)
                      .then((ab) =>
                        ab
                          ? `url(data:${res.headers.get("content-type")};base64,${Buffer.from(ab).toString("base64")})`
                          : undefined,
                      )
                  : undefined,
              )
          : undefined) ?? "linear-gradient(to right, #282828, #282828)"

      const rankCard = await generateRankCard({
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.displayAvatarURL({ extension: "png", size: 256 }),
        rank: userRank,
        level: userLevelData.level,
        currentXp: userLevelData.xp,
        targetXp: 500 * (userLevelData.level + 1),
        bannerImage,
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
