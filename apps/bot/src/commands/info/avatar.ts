import * as Discord from 'discord.js'
import * as Utils from '@repo/utils/bot'
import * as Schemas from '@repo/utils/schemas'


export default Utils.Functions.clientSlashCommand({
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

    if (!member) return Utils.Functions.clientError(
      interaction,
      'No can do!',
      Utils.Enums.PhaseError.MemberNotFound
    )


    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Utils.Enums.PhaseColour.Primary)
          .setTitle(`${member.displayName}'s avatar`)
          .setImage(member.displayAvatarURL({ size: 4096 }))
      ],
    })

  }
})