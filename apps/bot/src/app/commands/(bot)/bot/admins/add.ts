import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"

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
      void interaction.editReply(BotErrorMessage.serverOnlyCommand().toJSON())
      return
    }

    if (interaction.guild.ownerId !== interaction.user.id) {
      void interaction.editReply(BotErrorMessage.userNotOwner().toJSON())
      return
    }

    const user = interaction.options.getUser("user", true)

    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)!

    if (user.bot) {
      void interaction.editReply(
        new BotErrorMessage(
          `<@${user.id}> is a bot, not a regular user.`,
        ).toJSON(),
      )

      return
    }

    if (guildDoc.admins.includes(user.id)) {
      void interaction.editReply(
        new BotErrorMessage(
          `<@${user.id}> already has dashboard access.`,
        ).toJSON(),
      )

      return
    }

    await db.guilds.updateOne(
      { id: interaction.guildId! },
      { $push: { admins: user.id } },
    )

    void interaction.editReply(
      `<@${user.id}> has been granted dashboard access.`,
    )
  })
