import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("set")
  .setDescription("Sets a users rank data.")
  .addUserOption((option) =>
    option.setName("user").setDescription("Specify a user.").setRequired(true),
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
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const user = interaction.options.getUser("user", true)
    const level = interaction.options.getInteger("level", true)
    const xp = interaction.options.getInteger("xp", true)

    const guildDoc = await cache.guilds.get(interaction.guildId!)

    if (!guildDoc?.modules?.[ModuleId.Levels]?.enabled) {
      return void interaction.reply(
        BotError.moduleNotEnabled(ModuleId.Levels).toJSON(),
      )
    }

    const levelDoc = await db.levels.findOne({
      guild: interaction.guildId!,
      user: user.id,
    })

    if (!levelDoc)
      void db.levels.create({
        guild: interaction.guildId,
        user: user.id,
        level: level,
        xp: level,
      })
    else {
      levelDoc.level = level
      levelDoc.xp = xp

      void levelDoc.save()
    }

    void interaction.reply({
      content: "Level data has been updated.",
      ephemeral: true,
    })
  })
