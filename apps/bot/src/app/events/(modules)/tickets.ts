import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"

import type { UUID } from "crypto"
import type { AnyThreadChannel, TextChannel } from "discord.js"

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
        !(
          interaction.guild!.members.me ??
          (await interaction.guild!.members.fetchMe())
        ).permissions.has(PermissionFlagsBits.ManageThreads)
      ) {
        return interaction.reply(
          BotErrorMessage.botMissingPermission("ManageThreads").toJSON(),
        )
      }

      const customIdParts = interaction.customId.split(".")

      const ticketAction = customIdParts[1] as "open" | "lock"
      const ticketId = customIdParts[2] as UUID

      const guildDoc = client.store.guilds.get(interaction.guildId)
      const moduleConfig = guildDoc?.modules?.[ModuleId.Tickets]

      if (!moduleConfig?.enabled) {
        return interaction.reply(
          BotErrorMessage.moduleNotEnabled(ModuleId.Tickets).toJSON(),
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
          BotErrorMessage.moduleNotEnabled(ModuleId.Tickets).toJSON(),
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
                new BotErrorMessage(
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
              `<@${interaction.user.id}>${ticketData.mention ? `<@&${ticketData.mention}>` : ""}`,
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

            await interaction.editReply(
              `Your ticket has been created! <#${ticket.id}>`,
            )
          }
          break

        case "lock":
          {
            const ticket = interaction.channel as AnyThreadChannel<boolean>

            if (ticket.locked) {
              return interaction.reply(
                new BotErrorMessage("The ticket is already locked.").toJSON(),
              )
            }

            await ticket.setLocked(true)
            await ticket.setName(ticket.name.replace("🎫", "🔒"))

            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(PhaseColour.Primary)
                  .setDescription(
                    `Ticket locked by <@${interaction.user.id}>\n\nModerators can unlock this ticket using \`/ticket unlock\`.`,
                  )
                  .setTitle("Ticket Locked"),
              ],
            })
          }
          break
      }
    }
  })
