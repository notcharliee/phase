import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays a member\'s avatar.')
    .setDMPermission(false)
    .addUserOption(
      new Discord.SlashCommandUserOption()
        .setName('member')
        .setDescription('The member you want to select.')
        .setRequired(true)
    ),
  async execute(client, interaction) {

    const member = interaction.options.getMember('member') as Discord.GuildMember || null

    if (!member) return Utils.clientError(
      interaction,
      'No can do!',
      Utils.PhaseError.MemberNotFound
    )


    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.PhaseColour.Primary)
          .setTitle(`${member.displayName}'s avatar`)
          .setImage(member.displayAvatarURL({ size: 4096 }))
      ],
    })

  }
})