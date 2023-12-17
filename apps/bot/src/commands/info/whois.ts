import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('whois')
    .setDescription('Displays member data in an embed.')
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


    const keyPermissionsArray = Utils.keyPermissionsArray

    const memberPermissions = member.permissions.serialize(true) // @ts-ignore
    const permissionsArray = keyPermissionsArray.filter(permission => memberPermissions[permission])


    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setAuthor({
            iconURL: member.displayAvatarURL(),
            name: member.displayName
          })
          .setColor(Utils.PhaseColour.Primary)
          .setDescription(`${member}`)
          .setFields([
            {
              inline: true,
              name: 'Joined',
              value: member.joinedAt ? Utils.formatDate(member.joinedAt) : 'Unknown',
            },
            {
              inline: true,
              name: 'Registered',
              value: Utils.formatDate(member.user.createdAt),
            },
            {
              inline: false,
              name: `Roles [${member.roles.cache.size - 1}]`,
              value: member.roles.cache
                .sort((roleA, roleB) => { return roleB.position - roleA.position })
                .map(role => { return `${role.name != '@everyone' ? role : ''}` })
                .toString()
                .replaceAll(',', ' '),
            },
            {
              inline: false,
              name: `Key Permissions [${permissionsArray.length}]`,
              value: permissionsArray.length
                ? permissionsArray.map(permission => { return permission.replace(/([a-z])([A-Z])/g, '$1 $2') }).toString().replaceAll(',', ', ')
                : 'None',
            },
          ])
          .setFooter({
            text: `ID: ${member.id}`
          })
          .setThumbnail(member.displayAvatarURL())
          .setTimestamp()
      ],
    })

  }
})