import { botEvent } from "phase.js"
import { GuildSchema } from "@repo/schemas"
import { PhaseColour, PhaseEmoji, moduleNotEnabled } from "~/utils"
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  TextChannel,
} from "discord.js"

export default botEvent("interactionCreate", async (client, interaction) => {
  if (
    interaction.isButton() &&
    /ticket.(open|lock|unlock|delete).[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(
      interaction.customId,
    ) &&
    interaction.inGuild() &&
    interaction.member &&
    interaction.channel
  ) {
    const customIdParts = interaction.customId.split(".") as [
      "ticket", // button type
      "open" | "lock" | "unlock" | "delete", // ticket action
      `${string}-${string}-${string}-${string}-${string}`, // ticket id
    ]

    const ticketAction = customIdParts[1]
    const ticketId = customIdParts[2]

    const guildSchema = await GuildSchema.findOne({ id: interaction.guildId })
    const ticketModule = guildSchema?.modules.Tickets
    if (!ticketModule?.enabled) return moduleNotEnabled("Tickets")

    switch (ticketAction) {
      case "open":
        {
          await interaction.deferReply({
            ephemeral: true,
          })

          const ticketChannel = client.channels.cache.get(
            ticketModule.channel,
          ) as TextChannel | undefined
          const ticketData = ticketModule.tickets.find(
            (ticket) => ticket.id == ticketId,
          )

          if (!ticketChannel || !ticketData) return moduleNotEnabled("Tickets")

          const ticketMessage = `${interaction.member}`
          const ticketName = `🎫 ${interaction.member.user.username}`

          const ticketsOpen = ticketChannel.threads.cache.filter((thread) =>
            thread.name.startsWith(ticketName),
          ).size
          if (ticketsOpen >= ticketData.max_open)
            return interaction.editReply(
              `You can't open any more than ${ticketData.max_open} tickets at a time!`,
            )

          const ticketThread = await ticketChannel.threads.create({
            name: ticketName + (ticketsOpen ? `(${ticketsOpen + 1})` : ""),
            startMessage: ticketMessage,
            type: ChannelType.PrivateThread,
            invitable: true,
          })

          ticketThread.send({
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

          interaction.editReply(`Your ticket has been created! ${ticketThread}`)
        }
        break

      case "lock":
        {
          const ticketThread = interaction.channel
          const ticketData = ticketModule.tickets.find(
            (ticket) => ticket.id == ticketId,
          )

          if (!ticketThread.isThread() || !ticketData)
            return moduleNotEnabled("Tickets")

          if (ticketThread.locked)
            return interaction.reply(
              `${PhaseEmoji.Failure} You can't lock an already locked ticket!`,
            )
          else await interaction.deferUpdate()

          await ticketThread.send({
            components: [
              new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                  .setCustomId(`ticket.unlock.${ticketId}`)
                  .setEmoji("🔓")
                  .setLabel("Unlock Ticket")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId(`ticket.delete.${ticketId}`)
                  .setEmoji("🔥")
                  .setLabel("Delete Ticket")
                  .setStyle(ButtonStyle.Secondary),
              ),
            ],
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(`Ticket locked by ${interaction.member}`)
                .setTitle("Ticket Locked"),
            ],
          })

          ticketThread.setLocked(true)
        }
        break

      case "unlock":
        {
          const ticketThread = interaction.channel
          const ticketData = ticketModule.tickets.find(
            (ticket) => ticket.id == ticketId,
          )

          if (!ticketThread.isThread() || !ticketData)
            return moduleNotEnabled("Tickets")

          if (!ticketThread.locked)
            return interaction.reply(
              `${PhaseEmoji.Failure} You can't unlock an already unlocked ticket!`,
            )
          else await interaction.deferUpdate()

          await ticketThread.setLocked(false)

          ticketThread.send({
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
                .setDescription(`Ticket unlocked by ${interaction.member}`)
                .setTitle("Ticket Unlocked"),
            ],
          })
        }
        break

      case "delete":
        {
          const ticketThread = interaction.channel
          const ticketData = ticketModule.tickets.find(
            (ticket) => ticket.id == ticketId,
          )

          if (!ticketThread.isThread() || !ticketData)
            return moduleNotEnabled("Tickets")

          await interaction.deferUpdate()
          await interaction.message.delete()

          await ticketThread.send({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(`Ticket deleted by ${interaction.member}`)
                .setFooter({ text: "Thread will be deleted shortly..." })
                .setTitle("Ticket Deleted"),
            ],
          })

          setTimeout(() => ticketThread.delete(), 3 * 1000)
        }
        break
    }
  }
})
