import {
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ThreadAutoArchiveDuration,
} from "discord.js"
import { BotEventBuilder } from "@phasejs/core/builders"

import { ModuleId } from "@repo/utils/modules"

import { Emojis } from "~/lib/emojis"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (_, interaction) => {
    const { client } = interaction

    if (
      !interaction.isButton() ||
      !interaction.inGuild() ||
      !interaction.customId.startsWith("ticket.")
    ) {
      return
    }

    const guildDoc = client.stores.guilds.get(interaction.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.Tickets]

    if (!moduleConfig?.enabled) {
      return interaction.reply(
        BotErrorMessage[
          moduleConfig ? "moduleNotEnabled" : "moduleNotConfigured"
        ](ModuleId.Tickets),
      )
    }

    const customIdParts = interaction.customId.split(".")

    const ticketAction = customIdParts[1]!
    const ticketId = customIdParts[2]!

    const ticket = moduleConfig.tickets.find(({ id }) => ticketId === id)

    if (!ticket) {
      return interaction.reply(
        new BotErrorMessage(
          "The ticket you are trying to access no longer exists.",
        ),
      )
    }

    const isThreadBased = !moduleConfig.category
    const isCategoryBased = moduleConfig.category

    if (isThreadBased) {
      const guildChannels = interaction.guild?.channels.cache
      const panelChannel = guildChannels?.get(moduleConfig.channel)

      if (panelChannel?.type !== ChannelType.GuildText) {
        return interaction.reply(
          new BotErrorMessage("The panel channel no longer exists."),
        )
      }

      if (!panelChannel.permissionsFor(client.user)?.has("ManageThreads")) {
        return interaction.reply(
          BotErrorMessage.botMissingPermission("ManageThreads", true),
        )
      }

      if (ticketAction === "open") {
        await interaction.deferReply({ ephemeral: true })

        let ticketName = `🎫 ${interaction.user.username}`

        const threadsOpenedByUserCount = panelChannel.threads.cache.filter(
          (thread) => thread.name.startsWith(ticketName),
        ).size

        if (threadsOpenedByUserCount > 0) {
          if (
            moduleConfig.max_open &&
            threadsOpenedByUserCount >= moduleConfig.max_open
          ) {
            return interaction.editReply(
              new BotErrorMessage(
                "You are not allowed to open more than " +
                  `${moduleConfig.max_open} ticket` +
                  `${moduleConfig.max_open !== 1 ? "s" : ""} at a time.`,
              ),
            )
          }

          ticketName = `${ticketName} (${threadsOpenedByUserCount + 1})`
        }

        try {
          const ticketThread = await panelChannel.threads.create({
            name: ticketName,
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            invitable: false,
          })

          const ticketUserMention = `<@${interaction.user.id}>`
          const ticketModMention = ticket.mention ? `<@&${ticket.mention}>` : ""

          await ticketThread.send(
            new MessageBuilder()
              .setContent(ticketUserMention + ticketModMention)
              .setEmbeds((embed) => {
                return embed
                  .setColor("Primary")
                  .setTitle(ticket.name)
                  .setDescription(ticket.message)
                  .setTimestamp()
              })
              .setComponents((actionrow) => {
                return actionrow.addComponents(
                  new ButtonBuilder()
                    .setCustomId(`ticket.lock.${ticketId}`)
                    .setEmoji(Emojis.LockClosed)
                    .setLabel("Lock Ticket")
                    .setStyle(ButtonStyle.Secondary),
                )
              }),
          )

          return interaction.editReply(`<#${ticketThread.id}>`)
        } catch (error) {
          console.error(`[Tickets] Failed to create ticket thread:`)
          console.error(error)

          return interaction.editReply(
            new BotErrorMessage("Failed to create the ticket thread."),
          )
        }
      }

      if (ticketAction === "lock") {
        await interaction.deferReply()

        const ticketThread = interaction.channel

        if (ticketThread?.type !== ChannelType.PrivateThread) {
          return interaction.editReply(
            new BotErrorMessage("This is not a ticket thread."),
          )
        }

        if (ticketThread.locked) {
          return interaction.editReply(
            new BotErrorMessage("This ticket is already locked."),
          )
        }

        try {
          await ticketThread.setLocked(true)
          await ticketThread.setName(ticketThread.name.replace("🎫", "🔒"))

          const ticketCommandId = client.application?.commands.cache.find(
            ({ name }) => name === "ticket",
          )!.id

          const ticketUserMention = `<@${interaction.user.id}>`
          const ticketCommandMention = `</ticket unlock:${ticketCommandId}>`

          return interaction.editReply(
            new MessageBuilder().setEmbeds((embed) => {
              embed.setColor("Primary")
              embed.setTitle("Ticket Locked")
              embed.setDescription(`
                Ticket has been locked by ${ticketUserMention}
                
                Moderators can unlock this ticket with ${ticketCommandMention}
              `)

              return embed
            }),
          )
        } catch {
          return interaction.editReply(
            new BotErrorMessage("Failed to lock the ticket thread."),
          )
        }
      }
    }

    if (isCategoryBased) {
      // TODO: implement category-based tickets

      return interaction.reply(
        new BotErrorMessage("How did you even get here?"),
      )
    }
  })
