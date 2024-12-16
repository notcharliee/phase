import { BotSubcommandBuilder } from "@phasejs/builders"
import { EmbedBuilder, PermissionFlagsBits } from "discord.js"

import { ModuleId } from "@repo/utils/modules"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("lock")
  .setDescription("Locks a ticket.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)
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

    if (ticket.locked) {
      void interaction.reply(
        new BotErrorMessage("Ticket is already locked.").toJSON(),
      )

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
