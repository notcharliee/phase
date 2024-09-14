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
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
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
        !(interaction.guild!.members.me ??
          (await interaction.guild!.members.fetchMe()))!.permissions.has(
          PermissionFlagsBits.ManageThreads,
        )
      ) {
        return interaction.reply(
          BotError.botMissingPermission("ManageThreads").toJSON(),
        )
      }

      const customIdParts = interaction.customId.split(".")

      const ticketAction = customIdParts[1] as "open" | "lock"
      const ticketId = customIdParts[2] as UUID

      const guildDoc = client.store.guilds.get(interaction.guildId)
      const moduleConfig = guildDoc?.modules?.[ModuleId.Tickets]

      if (!moduleConfig?.enabled) {
        return interaction.reply(
          BotError.moduleNotEnabled(ModuleId.Tickets).toJSON(),
        )
      }

      const ticketData = moduleConfig.tickets.find(
        (ticket) => ticket.id == ticketId,
      )

      const ticketChannel = client.channels.cache.get(moduleConfig.channel) as
        | TextChannel
        | undefined

      if (!ticketData || !ticketChannel) {
        return interaction.reply(
          BotError.moduleNotEnabled(ModuleId.Tickets).toJSON(),
        )
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

            if (moduleConfig.max_open && ticketsOpen >= moduleConfig.max_open) {
              return interaction.editReply(
                new BotError(
                  `You are not allowed to open more than ${moduleConfig.max_open} ticket${moduleConfig.max_open > 1 ? "s" : ""} at a time.`,
                ).toJSON(),
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
                new BotError("The ticket is already locked.").toJSON(),
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
