import { EmbedBuilder, PermissionFlagsBits } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("unlock")
  .setDescription("Unlocks a ticket.")
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

    if (!ticket.locked) {
      void interaction.reply(
        new BotErrorMessage("Ticket is already unlocked.").toJSON(),
      )

      return
    }

    void ticket.setName(ticket.name.replace("🔒", "🎫"))
    void ticket.setLocked(false)

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Ticket Unlocked")
          .setDescription(
            dedent`
              Ticket unlocked by ${interaction.member}
            `,
          ),
      ],
    })
  })
