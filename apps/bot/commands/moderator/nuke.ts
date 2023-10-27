import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Deletes the current channel and creates an exact copy with no messages.')
    .setDMPermission(false),
  permissions: {
    baseCommand: Discord.PermissionFlagsBits.ManageChannels,
  },
  async execute(client, interaction) {

    if (!interaction.channel) return

    if (interaction.channel.isThread()) return Utils.Functions.clientError(
      interaction,
      'No can do!',
      'This command cannot be used in threads.'
    )

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor('Yellow')
          .setDescription(`This command will delete ${interaction.channel}, then create a new channel with the same settings. All message history will be lost forever.\n\nAny bots, webhooks, or third-party applications currently connected to ${interaction.channel} will not be transferred to the new channel. You will need to reconnect them manually.\n\nThis action is irreversible, are you absolutely sure you wish to proceed?`)
          .setTitle('⚠️ Warning')
      ],
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`nuke.proceed`)
              .setLabel('Nuke')
              .setStyle(Discord.ButtonStyle.Danger)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`nuke.abort`)
              .setLabel('Abort')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
      ]
    })

  }
})