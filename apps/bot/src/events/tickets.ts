import { UUID } from "crypto"

import {
  ActionRowBuilder,
  AnyThreadChannel,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js"
import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { errorMessage, missingPermission, moduleNotEnabled } from "~/lib/utils"

export default botEvent("interactionCreate", async (client, interaction) => {
  if (
    interaction.isButton() &&
    /ticket.(open|lock).[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(
      interaction.customId,
    ) &&
    interaction.inGuild() &&
    interaction.member &&
    interaction.channel
  ) {
    if (
      !(await interaction.guild?.members.fetchMe())!.permissions.has(
        PermissionFlagsBits.ManageThreads,
      )
    ) {
      return interaction.reply(
        missingPermission(PermissionFlagsBits.ManageThreads, true),
      )
    }

    const customIdParts = interaction.customId.split(".")

    const ticketAction = customIdParts[1] as "open" | "lock"
    const ticketId = customIdParts[2] as UUID

    const guildSchema = await db.guilds.findOne({ id: interaction.guildId })
    const ticketModule = guildSchema?.modules?.Tickets

    if (!ticketModule?.enabled) {
      return interaction.reply(moduleNotEnabled("Tickets"))
    }

    const ticketData = ticketModule.tickets.find(
      (ticket) => ticket.id == ticketId,
    )

    const ticketChannel = client.channels.cache.get(ticketModule.channel) as
      | TextChannel
      | undefined

    if (!ticketData || !ticketChannel) {
      return interaction.reply(moduleNotEnabled("Tickets"))
    }

    switch (ticketAction) {
      case "open":
        {
          await interaction.deferReply({
            ephemeral: true,
          })

          const ticketName = `🎫 ${interaction.member.user.username}`

          const ticketsOpen = ticketChannel.threads.cache.filter((thread) =>
            thread.name.startsWith(ticketName),
          ).size

          if (ticketModule.max_open && ticketsOpen >= ticketModule.max_open) {
            return interaction.editReply(
              errorMessage({
                title: "Failed to open",
                description: `You are not allowed to open more than ${ticketModule.max_open} ticket${ticketModule.max_open > 1 ? "s" : ""} at a time.`,
                ephemeral: true,
              }),
            )
          }

          const ticket = await ticketChannel.threads.create({
            name: ticketName + (ticketsOpen ? ` (${ticketsOpen + 1})` : ""),
            type: ChannelType.PrivateThread,
            invitable: true,
          })

          await ticket.send(
            `${interaction.member}${ticketData.mention ? `<@&${ticketData.mention}>` : ""}`,
          )

          await ticket.send({
            components: [
              new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                  .setCustomId(`ticket.lock.${ticketId}`)
                  .setEmoji("🔒")
                  .setLabel("Lock Ticket")
                  .setStyle(ButtonStyle.Secondary),
              ),
            ],
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(ticketData.message)
                .setTitle(ticketName),
            ],
          })

          interaction.editReply(`Your ticket has been created! ${ticket}`)
        }
        break

      case "lock":
        {
          const ticket = interaction.channel as AnyThreadChannel<boolean>

          if (ticket.locked) {
            return interaction.reply(
              errorMessage({
                title: "Failed to lock",
                description: "Ticket is already locked.",
              }),
            )
          }

          ticket.setLocked(true)
          ticket.setName(ticket.name.replace("🎫", "🔒"))

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
        }
        break
    }
  }
})
