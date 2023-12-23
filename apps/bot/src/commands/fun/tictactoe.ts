import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
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

    const member = interaction.options.getMember('member') as Discord.GuildMember | null

    if (!member) return Utils.clientError(
      interaction,
      'No can do!',
      Utils.PhaseError.MemberNotFound
    )


    const message = await interaction.reply({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.1')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.2')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.3')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.4')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.5')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.6')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.7')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.8')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.9')
          .setLabel(Utils.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
      ],
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Utils.PhaseColour.Primary)
        .setDescription(`${member} it's your go. Make a move!`)
        .setTitle('TicTacToe')
      ],
      fetchReply: true,
    })


    new Schemas.GameSchema({
      id: message.id,
      type: 'TICTACTOE',
      game_data: {
        current_turn: {
          marker: Utils.PhaseEmoji.Cross,
          player: member.id,
        },
        moves: [
          Utils.PhaseEmoji.ZeroWidthJoiner, Utils.PhaseEmoji.ZeroWidthJoiner, Utils.PhaseEmoji.ZeroWidthJoiner,
          Utils.PhaseEmoji.ZeroWidthJoiner, Utils.PhaseEmoji.ZeroWidthJoiner, Utils.PhaseEmoji.ZeroWidthJoiner,
          Utils.PhaseEmoji.ZeroWidthJoiner, Utils.PhaseEmoji.ZeroWidthJoiner, Utils.PhaseEmoji.ZeroWidthJoiner,
        ],
      },
      players: [
        interaction.user.id,
        member.id,
      ],
    }).save()

  }
})