import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


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

        
        const apiResponse = await fetch(`https://phasebot.xyz/api/image/levels/user.png?user=${userId}&guild=${interaction.guildId}&date=${Date.now()}`)

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
        const rankEnd = rankStart + (rankCount - 1)

        const apiResponse = await fetch(`https://phasebot.xyz/api/image/levels/guild.png?rankStart=${rankStart}&rankEnd=${rankEnd}&guild=${interaction.guildId}&date=${Date.now()}`)

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

        const user = interaction.options.getUser('user', true)
        const level = interaction.options.getInteger('level', true)
        const xp = interaction.options.getInteger('xp', true)

        const guildSchema = await Schemas.GuildSchema.findOne({ id: interaction.guildId })
        const levelSchema = await Schemas.LevelSchema.findOne({ guild: interaction.guildId, user: user.id })

        if (!guildSchema?.modules.Levels.enabled) Utils.moduleNotEnabled(interaction, "Levels & XP")

        if (!levelSchema) new Schemas.LevelSchema({
          guild: interaction.guildId,
          user: user.id,
          level: level,
          xp: level,
        }).save(); else {
          levelSchema.level = level
          levelSchema.xp = xp
          levelSchema.save()
        }

        interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Utils.PhaseColour.Primary)
            .setDescription('Level data was updated successfully.')
            .setTitle('Level Data Set')
          ],
        })

      } break

    }

  }
})