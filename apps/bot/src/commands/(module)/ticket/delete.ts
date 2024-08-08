import { EmbedBuilder, PermissionFlagsBits } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"
import dedent from "dedent"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("delete")
  .setDescription("Deletes a ticket.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const guildDoc = await db.guilds.findOne({ id: interaction.guildId })
    const ticketModule = guildDoc?.modules?.[ModuleId.Tickets]

    if (!ticketModule?.enabled) {
      return void interaction.reply(
        BotError.moduleNotEnabled(ModuleId.Tickets).toJSON(),
      )
    }

    const ticket = interaction.channel

    if (!ticket?.isThread() || ticket.parentId !== ticketModule.channel) {
      void interaction.reply(
        new BotError(
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
        BotError.botMissingPermission("ManageThreads").toJSON(),
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

    setTimeout(() => ticket.delete().catch(() => null), 3_000)
  })
