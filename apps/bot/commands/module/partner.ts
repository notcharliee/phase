import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('partner')
    .setDescription('partner')
    .setDMPermission(false)
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('Adds new partners via partner invite code.')
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('code')
            .setDescription('Enter a valid partner invite code.')
            .setRequired(true)
            .setMinLength(8)
            .setMaxLength(8)
        )
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('advert')
        .setDescription('Opens a modal for setting the server advert.')
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('channel')
        .setDescription('Sets the partnership channel.')
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('invite')
        .setDescription('Generates a unique one-time partner invite code.')
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('list')
        .setDescription('Lists current partners by server name and ID.')
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('Removes existing partners via server IDs.')
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('server')
            .setDescription('Enter a valid partner server ID.')
            .setRequired(true)
            .setMinLength(8)
        )
    ),
  permissions: {
    baseCommand: Discord.PermissionFlagsBits.ManageGuild,
  },
  async execute(client, interaction) {

    const guildPartnerSchema = await Schemas.AutoPartners.findOne({ guild: interaction.guildId }) ?? await new Schemas.AutoPartners({
      guild: interaction.guildId,
      channel: interaction.channelId,
      advert: undefined,
      partners: [],
      invites: [],
    }).save()

    switch (interaction.options.getSubcommand()) {

      case 'add': {

        await interaction.deferReply()

        // Returns an error if no channel or advert for this server is present.

        if (!guildPartnerSchema.channel || !guildPartnerSchema.advert) return Utils.Functions.clientError<true>(
          interaction,
          'No can do!',
          'There is no advert or partnership channel setup for this server.'
        )


        // Returns an error if the invite code is invalid or if code belongs to same server or if a partnership already exists.

        const inviteCode = interaction.options.getString('code', true)
        const invitePartnerSchema = await Schemas.AutoPartners.findOne({ invites: { $elemMatch: { code: inviteCode } } })

        if (!invitePartnerSchema || invitePartnerSchema.invites.find(invite => invite.code == inviteCode)!.expires <= new Date().getTime().toString()) return Utils.Functions.clientError<true>(
          interaction,
          'No can do!',
          'The invite code is either invalid or has expired.'
        )

        if (invitePartnerSchema.guild == interaction.guildId) return Utils.Functions.clientError<true>(
          interaction,
          'No can do!',
          'You can\'t partner with your own server!'
        )

        if (guildPartnerSchema.partners.find(partner => partner.guildId == invitePartnerSchema!.guild)) return Utils.Functions.clientError<true>(
          interaction,
          'No can do!',
          'That server is already partnered here.'
        )


        // Attempts to send partnership adverts to each server's channels, throws error if there's an issue.

        try {

          const invitePartnerMessage = await (client.channels.cache.get(invitePartnerSchema.channel!) as Discord.TextChannel | undefined)?.send(guildPartnerSchema.advert)
          const guildPartnerMessage = await (client.channels.cache.get(guildPartnerSchema.channel) as Discord.TextChannel | undefined)?.send(invitePartnerSchema.advert!)

          if (!invitePartnerMessage || !guildPartnerMessage) {

            return Utils.Functions.clientError<true>(
              interaction,
              'Well, this is awkward..',
              Utils.Enums.PhaseError.Unknown
            )

          }

          invitePartnerSchema.partners.push({
            guildId: guildPartnerMessage.guildId,
            channelId: guildPartnerMessage.channelId,
            messageId: invitePartnerMessage.id,
          })

          guildPartnerSchema.partners.push({
            guildId: invitePartnerMessage.guildId,
            channelId: invitePartnerMessage.channelId,
            messageId: guildPartnerMessage.id,
          })

          await invitePartnerSchema.save()
          await guildPartnerSchema.save()

          interaction.editReply({
            embeds: [
              new Discord.EmbedBuilder()
                .setColor(Utils.Enums.PhaseColour.Primary)
                .setDescription(`**${interaction.guild!.name}** has successfully partnered with **${client.guilds.cache.get(invitePartnerSchema.guild)!.name}**`)
                .setTitle(Utils.Enums.PhaseEmoji.Success + 'Partnership Created')
            ],
          })

        } catch (error) {

          Utils.Functions.alertDevs({
            title: `Auto-Partner Error`,
            description: `${error}`,
            type: 'warning',
          })

          Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            Utils.Enums.PhaseError.Unknown
          )

        }

      } break



      case 'advert': { // TEMPORARY COMMAND //

        // Opens advert-builder modal.

        const modalTextComponent = new Discord.TextInputBuilder()
          .setCustomId('autopartner.advert.text')
          .setLabel('Describe your server!')
          .setMaxLength(2000)
          .setMinLength(1)
          .setPlaceholder('Your advert must include an invite to your server and follow the Discord community guidelines.')
          .setRequired(true)
          .setStyle(Discord.TextInputStyle.Paragraph)

        if (guildPartnerSchema.advert) modalTextComponent.setValue(guildPartnerSchema.advert)

        const modalComponents = new Discord.ActionRowBuilder<Discord.TextInputBuilder>()
          .addComponents(modalTextComponent)

        const modal = new Discord.ModalBuilder()
          .addComponents(modalComponents)
          .setCustomId('autopartner.advert')
          .setTitle('Server Advert Settings')

        const showModal = await interaction.showModal(modal)
        Promise.resolve(showModal)

      } break



      case 'channel': { // TEMPORARY COMMAND //

        // Sets the advert channel.

        guildPartnerSchema.channel = interaction.channelId
        guildPartnerSchema.save()

        interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`Partnership channel set to ${interaction.channel}`)
              .setTitle(Utils.Enums.PhaseEmoji.Success + 'Channel Set')
          ],
        })

      } break



      case 'invite': {

        await interaction.deferReply()

        // Returns an error if no channel or advert for this server is present.

        if (!guildPartnerSchema.channel || !guildPartnerSchema.advert) return Utils.Functions.clientError<true>(
          interaction,
          'No can do!',
          'There is no advert or partnership channel setup for this server.'
        )


        // Creates partner invite code, then saves it to the Schemas.

        async function newInviteCode() {

          let inviteCode = createInvideCode()
      
          while (await Schemas.AutoPartners.findOne({ invites: { $elemMatch: { code: inviteCode } } })) {
            inviteCode = createInvideCode()
          }
      
          return inviteCode
      
          function createInvideCode() {

            let inviteCode = ''

            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

            for (let i = 0; i < 8; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length)
              inviteCode += characters.charAt(randomIndex)
            }
      
            return inviteCode
      
          }
        
        }

        const inviteCode = await newInviteCode()

        const inviteExpires = new Date().getTime() + 15 * 60 * 1000
        const inviteExpiresTimestamp = `<t:${Math.floor(inviteExpires / 1000)}:R>`

        guildPartnerSchema.invites.push({ code: inviteCode, expires: inviteExpires.toString() })
        guildPartnerSchema.save()


        // Finally sends the invite code along with the expiry time.

        interaction.editReply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`Run the \`/partner add\` command in another server to active the partnership.\n\n**Code:** ${inviteCode}\n**Expires:** ${inviteExpiresTimestamp}`)
              .setTitle(Utils.Enums.PhaseEmoji.Success + 'Invite Code Created')
          ],
        })

      } break



      case 'list': {

        await interaction.deferReply()

        // Creates the embed description by looping over the guild's partner array.

        let embedDescription = 'No partners found.'

        if (guildPartnerSchema.partners.length) embedDescription = guildPartnerSchema.partners.map((partner, index) => {
          const partnerGuild = client.guilds.cache.get(partner.guildId)
          if (!partnerGuild) return ''

          return `${index}. **${partnerGuild.name}**\n${partnerGuild.id}`
        }).toString().replace(',', '\n\n')


        // Sends the embed as the interaction reply.

        interaction.editReply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(embedDescription)
              .setTitle(`Partner List (${guildPartnerSchema.partners.length})`)
          ],
        })

      } break



      case 'remove': {

        await interaction.deferReply()

        const partnerGuildId = interaction.options.getString('server', true).toString()

        const invitePartnerSchema = await Schemas.AutoPartners.findOne({ guild: partnerGuildId })
        const guildPartnerSchema = await Schemas.AutoPartners.findOne({ guild: interaction.guildId })

        // Returns an error if schema is present for either server.

        if (!invitePartnerSchema || !guildPartnerSchema) return Utils.Functions.clientError<true>(
          interaction,
          'No can do!',
          'The server ID you provided is invalid.'
        )

        // Attempts to remove partnership messages and remove the partnership data from both schemas, throws error if there's an issue.

        try {

          const invitePartnerChannel = client.channels.cache.get(invitePartnerSchema.channel!) as Discord.TextChannel | undefined
          const invitePartnerMessage = await invitePartnerChannel?.messages.fetch(invitePartnerSchema.partners.find(partner => partner.guildId == guildPartnerSchema.guild)!.messageId)

          await invitePartnerMessage?.delete()

        } catch (error) {

          Utils.Functions.alertDevs({
            title: `Auto-Partner Error`,
            description: `${error}`,
            type: 'warning',
          })

          return Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            `Your advert could not be deleted from the partnered guild's partnership channel. This could be due to the server removing the bot, deleting or changing the channel, or revoking channel access permissions from the bot. For more details, please contact Phase Support.`
          )

        }

        try {

          const guildPartnerChannel = client.channels.cache.get(guildPartnerSchema.channel!) as Discord.TextChannel | undefined
          const guildPartnerMessage = await guildPartnerChannel?.messages.fetch(guildPartnerSchema.partners.find(partner => partner.guildId == invitePartnerSchema.guild)!.messageId)

          await guildPartnerMessage?.delete()

        } catch (error) {

          Utils.Functions.alertDevs({
            title: `Auto-Partner Error`,
            description: `${error}`,
            type: 'warning',
          })

          return Utils.Functions.clientError<true>(
            interaction,
            'Well, this is awkward..',
            `The partnered guild's advert could not be deleted from this server's partnership channel. This could be due to the server removing the bot, deleting or changing the channel, or revoking channel access permissions from the bot. For more details, please contact Phase Support.`
          )

        }

        invitePartnerSchema.partners.splice(invitePartnerSchema.partners.findIndex(partner => partner.guildId == guildPartnerSchema!.guild), 1)
        guildPartnerSchema.partners.splice(guildPartnerSchema.partners.findIndex(partner => partner.guildId == invitePartnerSchema!.guild), 1)

        invitePartnerSchema.save()
        guildPartnerSchema.save()

        interaction.editReply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(`**${interaction.guild!.name}** has successfully unpartnered with **${client.guilds.cache.get(invitePartnerSchema.guild)!.name}**`)
              .setTitle(Utils.Enums.PhaseEmoji.Success + 'Partnership Terminated')
          ],
        })

      } break

    }

  }
})