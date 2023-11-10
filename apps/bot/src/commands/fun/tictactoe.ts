import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Play tic-tac-toe against another user.')
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


    const message = await interaction.reply({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.1')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.2')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.3')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.4')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.5')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.6')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.7')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.8')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.9')
          .setLabel(Utils.Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
      ],
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Utils.Enums.PhaseColour.Primary)
        .setDescription(`${member} it's your go. Make a move!`)
        .setTitle('TicTacToe')
      ],
      fetchReply: true,
    })


    await new Schemas.Games({
      guild: interaction.guildId,
      message: message.id,
      type: 'TICTACTOE',
      participants: [ interaction.user.id, member ],
      gameData: {
        currentTurn: {
          marker: Utils.Enums.PhaseEmoji.Cross,
          participant: member.id,
        },
        moves: [
          Utils.Enums.PhaseEmoji.ZeroWidthJoiner, Utils.Enums.PhaseEmoji.ZeroWidthJoiner, Utils.Enums.PhaseEmoji.ZeroWidthJoiner,
          Utils.Enums.PhaseEmoji.ZeroWidthJoiner, Utils.Enums.PhaseEmoji.ZeroWidthJoiner, Utils.Enums.PhaseEmoji.ZeroWidthJoiner,
          Utils.Enums.PhaseEmoji.ZeroWidthJoiner, Utils.Enums.PhaseEmoji.ZeroWidthJoiner, Utils.Enums.PhaseEmoji.ZeroWidthJoiner,
        ],
      }
    }).save()

  }
})