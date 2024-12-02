import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"

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
      void interaction.editReply(BotErrorMessage.serverOnlyCommand().toJSON())
      return
    }

    if (interaction.guild.ownerId !== interaction.user.id) {
      void interaction.editReply(BotErrorMessage.userNotOwner().toJSON())
      return
    }

    const user = interaction.options.getUser("user", true)

    if (user.id === interaction.user.id) {
      void interaction.editReply(
        new BotErrorMessage(
          "You can't remove yourself from the dashboard.",
        ).toJSON(),
      )

      return
    }

    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)!

    if (!guildDoc.admins.includes(user.id)) {
      void interaction.editReply(
        new BotErrorMessage(
          `<@${user.id}> does not have dashboard access.`,
        ).toJSON(),
      )

      return
    }

    await db.guilds.updateOne(
      { id: interaction.guildId! },
      { $pull: { admins: user.id } },
    )

    void interaction.editReply(
      `<@${user.id}> has had their dashboard access revoked.`,
    )
  })
