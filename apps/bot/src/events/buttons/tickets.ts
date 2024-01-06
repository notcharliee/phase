import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


export default Utils.clientButtonEvent({
  customId: /ticket.(open|lock|unlock|delete).[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  async execute(client, interaction) {
    if (
      !interaction.inGuild() ||
      !interaction.member ||
      !interaction.channel
    ) return

    const customIdParts = interaction.customId.split(".") as [
      "ticket", // button type
      "open" | "lock" | "unlock" | "delete", // ticket action
      `${string}-${string}-${string}-${string}-${string}`, // ticket id
    ]

    const ticketAction = customIdParts[1]
    const ticketId = customIdParts[2]

    const guildSchema = await Schemas.GuildSchema.findOne({ id: interaction.guildId })
    const ticketModule = guildSchema?.modules.Tickets
    if (!ticketModule?.enabled) return Utils.moduleNotEnabled(interaction, "Tickets")

    
    switch (ticketAction) {
      case "open": {
        await interaction.deferReply({
          ephemeral: true,
        })

        const ticketChannel = client.channels.cache.get(ticketModule.channel) as Discord.TextChannel | undefined
        const ticketData = ticketModule.tickets.find(ticket => ticket.id == ticketId)

        if (
          !ticketChannel ||
          !ticketData
        ) return Utils.moduleNotEnabled(interaction, "Tickets")

        const ticketMessage = `${interaction.member}`
        const ticketName = `🎫 ${interaction.member.user.username}`

        const ticketsOpen = ticketChannel.threads.cache.filter(thread => thread.name.startsWith(ticketName)).size
        if (ticketsOpen >= ticketData.max_open) return interaction.editReply(`You can't open any more than ${ticketData.max_open} tickets at a time!`)

        const ticketThread = await ticketChannel.threads.create({
          name: ticketName + (ticketsOpen ? `(${ticketsOpen+1})` : ""),
          startMessage: ticketMessage,
          type: Discord.ChannelType.PrivateThread,
          invitable: true,
        })

        ticketThread.send({
          components: [
            new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
            .setComponents(
              new Discord.ButtonBuilder()
              .setCustomId(`ticket.lock.${ticketId}`)
              .setEmoji("🔒")
              .setLabel("Lock Ticket")
              .setStyle(Discord.ButtonStyle.Secondary),
            ),
          ],
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Utils.PhaseColour.Primary)
            .setDescription(ticketData.message)
            .setTitle(ticketName),
          ],
        })

        interaction.editReply(`Your ticket has been created! ${ticketThread}`)
      } break


      case "lock": {
        const ticketThread = interaction.channel
        const ticketData = ticketModule.tickets.find(ticket => ticket.id == ticketId)

        if (
          !ticketThread.isThread() ||
          !ticketData
        ) return Utils.moduleNotEnabled(interaction, "Tickets")

        if (ticketThread.locked)
          return interaction.reply(`${Utils.PhaseEmoji.Failure} You can't lock an already locked ticket!`)
        else
          await interaction.deferUpdate()

        await ticketThread.send({
          components: [
            new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
            .setComponents(
              new Discord.ButtonBuilder()
              .setCustomId(`ticket.unlock.${ticketId}`)
              .setEmoji("🔓")
              .setLabel("Unlock Ticket")
              .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
              .setCustomId(`ticket.delete.${ticketId}`)
              .setEmoji("🔥")
              .setLabel("Delete Ticket")
              .setStyle(Discord.ButtonStyle.Secondary),
            ),
          ],
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Utils.PhaseColour.Primary)
            .setDescription(`Ticket locked by ${interaction.member}`)
            .setTitle("Ticket Locked"),
          ],
        })

        ticketThread.setLocked(true)
      } break


      case "unlock": {
        const ticketThread = interaction.channel
        const ticketData = ticketModule.tickets.find(ticket => ticket.id == ticketId)

        if (
          !ticketThread.isThread() ||
          !ticketData
        ) return Utils.moduleNotEnabled(interaction, "Tickets")

        if (!ticketThread.locked)
          return interaction.reply(`${Utils.PhaseEmoji.Failure} You can't unlock an already unlocked ticket!`)
        else
          await interaction.deferUpdate()

        await ticketThread.setLocked(false)

        ticketThread.send({
          components: [
            new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
            .setComponents(
              new Discord.ButtonBuilder()
              .setCustomId(`ticket.lock.${ticketId}`)
              .setEmoji("🔒")
              .setLabel("Lock Ticket")
              .setStyle(Discord.ButtonStyle.Secondary),
            ),
          ],
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Utils.PhaseColour.Primary)
            .setDescription(`Ticket unlocked by ${interaction.member}`)
            .setTitle("Ticket Unlocked"),
          ],
        })
      } break


      case "delete": {
        const ticketThread = interaction.channel
        const ticketData = ticketModule.tickets.find(ticket => ticket.id == ticketId)

        if (
          !ticketThread.isThread() ||
          !ticketData
        ) return Utils.moduleNotEnabled(interaction, "Tickets")

        await interaction.deferUpdate()
        await interaction.message.delete()

        await ticketThread.send({
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Utils.PhaseColour.Primary)
            .setDescription(`Ticket deleted by ${interaction.member}`)
            .setFooter({ text: "Thread will be deleted shortly..." })
            .setTitle("Ticket Deleted"),
          ],
        })

        setTimeout(() => ticketThread.delete(), 3 * 1000)
      } break
    }
  }
})