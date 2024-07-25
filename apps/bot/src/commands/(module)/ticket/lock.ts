import { EmbedBuilder, PermissionFlagsBits } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import dedent from "dedent"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("lock")
  .setDescription("Locks a ticket.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const guildDoc = await db.guilds.findOne({ id: interaction.guildId })
    const ticketModule = guildDoc?.modules?.Tickets

    if (!ticketModule?.enabled) {
      void interaction.reply(BotError.moduleNotEnabled("Tickets").toJSON())
      return
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

    if (ticket.locked) {
      void interaction.reply(new BotError("Ticket is already locked.").toJSON())

      return
    }

    void ticket.setName(ticket.name.replace("🎫", "🔒"))
    void ticket.setLocked(true)

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Ticket Locked")
          .setDescription(
            dedent`
              Ticket locked by ${interaction.member}
              
              Moderators can unlock this ticket using </ticket unlock:${interaction.id}>.
            `,
          ),
      ],
    })
  })
