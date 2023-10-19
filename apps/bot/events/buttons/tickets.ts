import * as Discord from 'discord.js'
import * as Utils from 'utils'


export default Utils.Functions.clientButtonEvent({ // Supports either '-' or '.' separators for backwards compatibility. Eventually this will be changed to just support '.'
  customId: /ticket(\.|-)(open|close|reopen|claim|delete)(\.|-)[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  async execute(client, interaction) {

    if (!interaction.guild || !interaction.member || !interaction.channel) return
    
    const customIdParts = interaction.customId.includes('.') ? interaction.customId.split('.') : interaction.customId.split('-')
    const ticketId = [...customIdParts].slice(2, 7).join('-')

    switch (customIdParts[1]) {

      case 'open': {

        await interaction.deferReply({
          ephemeral: true,
        })

        const ticketsSchema = await Utils.Schemas.Tickets.findOne({ guild: interaction.guild.id })
        if (!ticketsSchema) return

        const ticketData = ticketsSchema.tickets.find(ticket => ticket.id == ticketId)
        if (!ticketData) return

        const permissionOverwrites: Discord.OverwriteResolvable[] = [
          {
            id: interaction.guild.id,
            deny: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: (interaction.member as Discord.GuildMember).id,
            allow: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: client.user.id,
            allow: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.ReadMessageHistory,
            ],
          },
        ]

        if (ticketData.permissions) for (const id of ticketData.permissions.access) {

          permissionOverwrites.push({
            id,
            allow: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.ReadMessageHistory,
            ],
          })

        }

        try {

          const ticket = await interaction.guild.channels.create({
            name: `${ticketData.name}-${ticketData.count}`,
            topic: (interaction.member as Discord.GuildMember).id,
            type: Discord.ChannelType.GuildText,
            parent: ticketData.category,
            permissionOverwrites,
          })
  
          await ticket.send({
            components: [
              new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
              .setComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-close-${ticketId}`)
                .setEmoji(Utils.Enums.PhaseEmoji.Locked)
                .setLabel('Close Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-claim-${ticketId}`)
                .setEmoji(Utils.Enums.PhaseEmoji.Pin)
                .setLabel('Claim Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
              )
            ],
            content: `${ticketData.message}`,
            embeds: ticketData.embed ? [
              new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(ticketData.embed.message)
              .setTitle(ticketData.embed.title)
            ] : undefined,
          })
  
          await Utils.Schemas.Tickets.findOneAndUpdate(
            { guild: interaction.guild.id, 'tickets.id': ticketId },
            { $inc: { 'tickets.$.count': 1 } }
          )
  
          interaction.editReply({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`Your ticket has been created! ${ticket}`)
              .setTitle(Utils.Enums.PhaseEmoji.Success + 'Ticket Created')
            ],
          })

        } catch (error) {

          Utils.Functions.alertDevs({
            title: 'Ticket Error',
            description: `${error}`,
            type: 'warning',
          })

          return Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            Utils.Enums.PhaseError.Unknown,
            true,
          )

        }

      } break



      case 'close': {

        const ticketsSchema = await Utils.Schemas.Tickets.findOne({ guild: interaction.guild.id })
        if (!ticketsSchema) return

        const ticketData = ticketsSchema.tickets.find(ticket => ticket.id == ticketId)
        if (!ticketData) return

        if (
          ticketData.permissions?.locked?.close &&
          !(interaction.member as Discord.GuildMember).roles.cache.some(role => ticketData?.permissions?.access.includes(role.id))
        ) return Utils.Functions.clientError(
          interaction,
          'Access Denied!',
          Utils.Enums.PhaseError.AccessDenied,
          true,
        )

        try {

          await interaction.message.edit({
            components: [
              new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
              .setComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-reopen-${ticketId}`)
                .setEmoji(Utils.Enums.PhaseEmoji.Lock)
                .setLabel('Reopen Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-delete-${ticketId}`)
                .setEmoji(Utils.Enums.PhaseEmoji.Explode)
                .setLabel('Delete Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
              )
            ],
          })
  
          const channel = interaction.channel as Discord.BaseGuildTextChannel
  
          await interaction.channel.send({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`${interaction.member} has closed this ticket.`)
              .setTitle(Utils.Enums.PhaseEmoji.Locked + 'Ticket Closed')
            ],
          })
  
          await channel.permissionOverwrites.create(`${channel.topic}`, {
            ViewChannel: true,
            ReadMessageHistory: true,
            SendMessages: false
          })
  
          await interaction.deferUpdate()

        } catch (error) {

          Utils.Functions.alertDevs({
            title: 'Ticket Error',
            description: `${error}`,
            type: 'warning',
          })

          return Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            Utils.Enums.PhaseError.Unknown,
            true,
          )

        }

      } break



      case 'reopen': {

        const ticketsSchema = await Utils.Schemas.Tickets.findOne({ guild: interaction.guild.id })
        if (!ticketsSchema) return

        const ticketData = ticketsSchema.tickets.find(ticket => ticket.id == ticketId)
        if (!ticketData) return

        if (
          ticketData.permissions?.locked?.reopen &&
          !(interaction.member as Discord.GuildMember).roles.cache.some(role => ticketData?.permissions?.access.includes(role.id))
        ) return Utils.Functions.clientError(
          interaction,
          'Access Denied!',
          Utils.Enums.PhaseError.AccessDenied,
          true,
        )

        try {

          await interaction.message.edit({
            components: [
              new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
              .setComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-close-${ticketId}`)
                .setEmoji(Utils.Enums.PhaseEmoji.Locked)
                .setLabel('Close Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-claim-${ticketId}`)
                .setEmoji(Utils.Enums.PhaseEmoji.Pin)
                .setLabel('Claim Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
              )
            ],
          })
  
          const channel = interaction.channel as Discord.BaseGuildTextChannel
  
          await channel.send({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`${interaction.member} has reopened this ticket.`)
              .setTitle(Utils.Enums.PhaseEmoji.Lock + 'Ticket Reopened')
            ],
          })
  
          await channel.permissionOverwrites.create(`${channel.topic}`, {
            ViewChannel: true,
            ReadMessageHistory: true,
            SendMessages: true
          })
  
          await interaction.deferUpdate()

        } catch (error) {

          Utils.Functions.alertDevs({
            title: 'Ticket Error',
            description: `${error}`,
            type: 'warning',
          })

          return Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            Utils.Enums.PhaseError.Unknown,
            true,
          )

        }

      } break



      case 'claim': {

        const ticketsSchema = await Utils.Schemas.Tickets.findOne({ guild: interaction.guild.id })
        if (!ticketsSchema) return

        const ticketData = ticketsSchema.tickets.find(ticket => ticket.id == ticketId)
        if (!ticketData) return

        if (!(interaction.member as Discord.GuildMember).roles.cache.some(role => ticketData?.permissions?.access.includes(role.id))) return Utils.Functions.clientError(
          interaction,
          'Access Denied!',
          Utils.Enums.PhaseError.AccessDenied,
          true,
        )

        try {

          await interaction.message.edit({
            components: [
              new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
              .setComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-close-${ticketId}`)
                .setEmoji(Utils.Enums.PhaseEmoji.Locked)
                .setLabel('Close Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-claim-${ticketId}`)
                .setDisabled(true)
                .setEmoji(Utils.Enums.PhaseEmoji.Pin)
                .setLabel('Claim Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
              )
            ],
          })
  
          await interaction.channel.send({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`${interaction.member} has claimed this ticket.`)
              .setTitle(Utils.Enums.PhaseEmoji.Pin + 'Ticket Claimed')
            ],
          })
  
          await interaction.deferUpdate()

        } catch (error) {

          Utils.Functions.alertDevs({
            title: 'Ticket Error',
            description: `${error}`,
            type: 'warning',
          })

          return Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            Utils.Enums.PhaseError.Unknown,
            true,
          )

        }

      } break



      case 'delete': {

        const ticketsSchema = await Utils.Schemas.Tickets.findOne({ guild: interaction.guild.id })
        if (!ticketsSchema) return

        const ticketData = ticketsSchema.tickets.find(ticket => ticket.id == ticketId)
        if (!ticketData) return

        if (
          ticketData.permissions?.locked?.delete &&
          !(interaction.member as Discord.GuildMember).roles.cache.some(role => ticketData?.permissions?.access.includes(role.id))
        ) return Utils.Functions.clientError(
          interaction,
          'Access Denied!',
          Utils.Enums.PhaseError.AccessDenied,
          true,
        )

        try {

          await interaction.message.edit({
            components: [
              new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
              .setComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-reopen-${ticketId}`)
                .setDisabled(true)
                .setEmoji(Utils.Enums.PhaseEmoji.Lock)
                .setLabel('Reopen Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId(`ticket-delete-${ticketId}`)
                .setDisabled(true)
                .setEmoji(Utils.Enums.PhaseEmoji.Explode)
                .setLabel('Delete Ticket')
                .setStyle(Discord.ButtonStyle.Secondary),
              )
            ],
          })
  
          const channel = interaction.channel as Discord.BaseGuildTextChannel
  
          await channel.send({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`${interaction.member} has deleted this ticket.\nThis may take a few seconds...`)
              .setTitle(Utils.Enums.PhaseEmoji.Explode + 'Ticket Deleted')
            ],
          })
  
          await interaction.deferUpdate()

          setTimeout(() => {
            channel.delete().catch(() => {return})
          }, 3000)

        } catch (error) {

          Utils.Functions.alertDevs({
            title: 'Ticket Error',
            description: `${error}`,
            type: 'warning',
          })

          return Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            Utils.Enums.PhaseError.Unknown,
            true,
          )

        }

      } break

    }
    
  }
})