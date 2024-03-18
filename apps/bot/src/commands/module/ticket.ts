import { GuildSchema } from "@repo/schemas"
import { EmbedBuilder, PermissionFlagsBits } from "discord.js"
import { BotCommandBuilder, botCommand } from "phasebot"
import {
  PhaseColour,
  errorMessage,
  missingPermission,
  moduleNotEnabled,
} from "~/utils"

export default botCommand(
  new BotCommandBuilder()
    .setName("ticket")
    .setDescription("Lock, unlock, and delete tickets")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName("lock").setDescription("Lock the ticket."),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("unlock").setDescription("Unlock the ticket."),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("delete").setDescription("Delete the ticket."),
    ),
  async (client, interaction) => {
    const guildSchema = await GuildSchema.findOne({ id: interaction.guildId })
    const ticketModule = guildSchema?.modules?.Tickets

    if (!ticketModule?.enabled) {
      return interaction.reply(moduleNotEnabled("Tickets"))
    }

    const ticket = interaction.channel

    if (!ticket?.isThread() || ticket.parentId !== ticketModule.channel) {
      return interaction.reply(
        errorMessage({
          title: "Invalid channel",
          description: "You cannot use this command outside of a ticket.",
          ephemeral: true,
        }),
      )
    }

    if (
      !(await interaction.guild?.members.fetchMe())!.permissions.has(
        PermissionFlagsBits.ManageThreads,
      )
    ) {
      return interaction.reply(
        missingPermission(PermissionFlagsBits.ManageThreads, true),
      )
    }

    switch (interaction.options.getSubcommand()) {
      case "lock":
        {
          if (ticket.locked) {
            return interaction.reply(
              errorMessage({
                title: "Failed to lock",
                description: "Ticket is already locked.",
              }),
            )
          }

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(
                  `Ticket locked by ${interaction.member}\n\nModerators can unlock this ticket using \`/ticket unlock\`.`,
                )
                .setTitle("Ticket Locked"),
            ],
          })

          ticket.setName(ticket.name.replace("🎫", "🔒"))
          ticket.setLocked(true)
        }
        break

      case "unlock":
        {
          if (!ticket.locked) {
            return interaction.reply(
              errorMessage({
                title: "Failed to unlock",
                description: "Ticket is already unlocked.",
              }),
            )
          }

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(`Ticket unlocked by ${interaction.member}`)
                .setTitle("Ticket Unlocked"),
            ],
          })

          ticket.setName(ticket.name.replace("🔒", "🎫"))
          ticket.setLocked(false)
        }
        break

      case "delete":
        {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(`Ticket deleted by ${interaction.member}`)
                .setFooter({ text: "Thread will be deleted shortly..." })
                .setTitle("Ticket Deleted"),
            ],
          })

          setTimeout(() => ticket.delete().catch(() => {}), 3 * 1000)
        }
        break
    }
  },
)
