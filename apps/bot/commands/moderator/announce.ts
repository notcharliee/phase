import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('announce')
    .setDescription('Sends an announcement-style message as Phase.')
    .setDMPermission(false)
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('message')
        .setDescription('The announcement message.')
        .setMaxLength(4000)
        .setRequired(true)
    )
    .addRoleOption(
      new Discord.SlashCommandRoleOption()
        .setName('mention')
        .setDescription('What role to ping.')
        .setRequired(false)
    ),
  permissions: {
    baseCommand: Discord.PermissionFlagsBits.MentionEveryone,
  },
  async execute(client, interaction) {

    const author = interaction.member as Discord.GuildMember

    try {

      await interaction.channel?.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ iconURL: author.displayAvatarURL(), name: author.displayName })
            .setColor(Utils.Enums.PhaseColour.Primary)
            .setDescription(interaction.options.getString('message', true))
            .setTimestamp()
        ],
      })

      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Utils.Enums.PhaseColour.Primary)
            .setDescription('Announcement was created successfully.')
            .setTitle(Utils.Enums.PhaseEmoji.Success + 'Announcement Sent')
        ],
        ephemeral: true,
      })

    } catch (error) {

      Utils.Functions.alertDevs({
        title: `Command Failure: /${this.data.name}`,
        description: `${error}`,
        type: 'warning'
      })

      Utils.Functions.clientError(
        interaction,
        'Well, this is awkward..',
        Utils.Enums.PhaseError.Unknown
      )

    }

  }
})