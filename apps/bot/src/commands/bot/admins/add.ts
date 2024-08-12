import { BotSubcommandBuilder } from "phasebot/builders"

import { cache } from "~/lib/cache"
import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("add")
  .setDescription("Grants a member dashboard access.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The member to add.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    })

    if (!interaction.guild) {
      void interaction.editReply(BotError.serverOnlyCommand().toJSON())
      return
    }

    if (interaction.guild.ownerId !== interaction.user.id) {
      void interaction.editReply(BotError.userNotOwner().toJSON())
      return
    }

    const user = interaction.options.getUser("user", true)

    const guildDoc = (await cache.guilds.get(interaction.guildId!))!

    if (user.bot) {
      void interaction.editReply(
        new BotError(`${user} is a bot, not a regular user.`).toJSON(),
      )

      return
    }

    if (guildDoc.admins.includes(user.id)) {
      void interaction.editReply(
        new BotError(`${user} already has dashboard access.`).toJSON(),
      )

      return
    }

    const newAdmins = guildDoc.admins.concat(user.id)

    void db.guilds.updateOne(
      { id: interaction.guildId! },
      { admins: newAdmins },
    )

    void interaction.editReply(`${user} has been granted dashboard access.`)
  })
