import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('level')
    .setDescription('level')
    .setDMPermission(false)
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('rank')
        .setDescription('Generates your server rank card.')
        .addUserOption(
          new Discord.SlashCommandUserOption()
            .setName('user')
            .setDescription('Specify a user.')
            .setRequired(false)
        ) 
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('leaderboard')
        .setDescription('Generates the server level leaderboard.')
        .addIntegerOption(
          new Discord.SlashCommandIntegerOption()
            .setName('rank-start')
            .setDescription('What rank to start from.')
            .setMinValue(1)
            .setRequired(true)
        )
        .addIntegerOption(
          new Discord.SlashCommandIntegerOption()
            .setName('rank-count')
            .setDescription('How many ranks to include (maximum of 15 at a time).')
            .setMinValue(1)
            .setMaxValue(15)
            .setRequired(true)
        )
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('set')
        .setDescription('Sets a user\s rank data.')
        .addUserOption(
          new Discord.SlashCommandUserOption()
            .setName('user')
            .setDescription('Specify a user.')
            .setRequired(true)
        )
        .addIntegerOption(
          new Discord.SlashCommandIntegerOption()
            .setName('level')
            .setDescription('Set a new level rank for the user.')
            .setRequired(true)
        )
        .addIntegerOption(
          new Discord.SlashCommandIntegerOption()
            .setName('xp')
            .setDescription('Set a new xp rank for the user.')
            .setRequired(true)
        )
    ),
  permissions: {
    baseCommand: null,
    subCommands: {
      set: Discord.PermissionFlagsBits.ManageGuild,
    },
  },
  async execute(client, interaction) {

    switch (interaction.options.getSubcommand()) {

      case 'rank': {

        await interaction.deferReply()

        const userId = interaction.options.getUser('user', false)?.id ?? interaction.user.id

        
        const apiResponse = await fetch(`https://phasebot.xyz/api/gen/rank.png?user=${userId}&guild=${interaction.guildId}&date=${Date.now()}`)

        if (apiResponse.ok) {

          const imageArrayBuffer = await apiResponse.arrayBuffer()
          const imageBuffer = Buffer.from(imageArrayBuffer)
          const imageAttachment = new Discord.AttachmentBuilder(imageBuffer)

          interaction.editReply({
            files: [imageAttachment]
          })

        } else {

          return Utils.clientError<true>(
            interaction,
            'No can do!',
            'Make sure the Levels & XP module is enabled, then try again.'
          )

        }

      } break



      case 'leaderboard': {

        await interaction.deferReply()

        const rankStart = interaction.options.getInteger('rank-start', true)
        const rankCount = interaction.options.getInteger('rank-count', true)

        const startIndex = rankStart - 1
        const endIndex = startIndex + (rankCount - 1)


        const apiResponse = await fetch(`https://phasebot.xyz/api/gen/leaderboard.png?start=${startIndex}&end=${endIndex}&guild=${interaction.guildId}&date=${Date.now()}`)

        if (apiResponse.ok) {

          const imageArrayBuffer = await apiResponse.arrayBuffer()
          const imageBuffer = Buffer.from(imageArrayBuffer)
          const imageAttachment = new Discord.AttachmentBuilder(imageBuffer)

          interaction.editReply({
            files: [imageAttachment]
          })

        } else {

          return Utils.clientError<true>(
            interaction,
            'No can do!',
            'Make sure the Levels & XP module is enabled, then try again.'
          )

        }

      } break


      case 'set': {

        await interaction.deferReply()

        const user = interaction.options.getUser('user', true)
        const level = interaction.options.getInteger('level', true)
        const xp = interaction.options.getInteger('xp', true)


        const levelsSchema = await Schemas.Levels.findOne({ guild: interaction.guildId })

        if (!levelsSchema) return Utils.clientError<true>(
          interaction,
          'No can do!',
          'Make sure the Levels & XP module is enabled, then try again.'
        )

        const userIndex = levelsSchema.levels.findIndex(level => level.id == user.id)

        if (userIndex == -1) return Utils.clientError<true>(
          interaction,
          'No can do!',
          'The user has not sent any messages yet.'
        )

        levelsSchema.levels[userIndex] = {
          id: user.id,
          level,
          target: (500 * (level ?? 0)) + 500,
          xp
        }

        await levelsSchema.save()

        interaction.editReply({
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Utils.PhaseColour.Primary)
            .setDescription('Level data was updated successfully.')
            .setTitle(Utils.PhaseEmoji.Success + 'Level Data Set')
          ],
        })

      } break

    }

  }
})