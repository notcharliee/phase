import { EmbedBuilder, PermissionFlagsBits } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("delete")
  .setDescription("Deletes a ticket.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const guildDoc = interaction.client.store.guilds.get(interaction.guildId!)
    const ticketModule = guildDoc?.modules?.[ModuleId.Tickets]

    if (!ticketModule?.enabled) {
      return void interaction.reply(
        BotErrorMessage.moduleNotEnabled(ModuleId.Tickets).toJSON(),
      )
    }

    const ticket = interaction.channel

    if (!ticket?.isThread() || ticket.parentId !== ticketModule.channel) {
      void interaction.reply(
        new BotErrorMessage(
          "You cannot use this command outside of a ticket.",
        ).toJSON(),
      )

      return
    }

    if (
      !(interaction.guild?.members.me ??
        (await interaction.guild?.members.fetchMe()))!.permissions.has(
        PermissionFlagsBits.ManageThreads,
      )
    ) {
      void interaction.reply(
        BotErrorMessage.botMissingPermission("ManageThreads").toJSON(),
      )

      return
    }

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Ticket Deleted")
          .setDescription(
            dedent`
              Ticket deleted by ${interaction.member}
              This channel will be deleted in a few seconds...
            `,
          ),
      ],
    })

    setTimeout(() => {
      ticket.delete().catch(() => null)
    }, 3_000)
  })
