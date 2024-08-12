import { BotSubcommandBuilder } from "phasebot/builders"

import { cache } from "~/lib/cache"
import { db } from "~/lib/db"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("remove")
  .setDescription("Revokes a member's dashboard access.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The member to remove.")
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

    if (user.id === interaction.user.id) {
      void interaction.editReply(
        new BotError("You can't remove yourself from the dashboard.").toJSON(),
      )

      return
    }

    const guildDoc = (await cache.guilds.get(interaction.guildId!))!

    if (!guildDoc.admins.includes(user.id)) {
      void interaction.editReply(
        new BotError(`${user} does not have dashboard access.`).toJSON(),
      )

      return
    }

    const newAdmins = guildDoc.admins.filter((admin) => admin !== user.id)

    void db.guilds.updateOne(
      { id: interaction.guildId! },
      { admins: newAdmins },
    )

    void interaction.editReply(
      `${user} has had their dashboard access revoked.`,
    )
  })
