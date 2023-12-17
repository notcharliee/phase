import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status.')
    .setDMPermission(false)
    .addStringOption(
      new Discord.SlashCommandStringOption()
      .setName('reason')
      .setDescription('Give a reason for going AFK.')
      .setRequired(false)
    ),
  async execute(client, interaction) {
    
    const reason = interaction.options.getString('reason', false) ?? 'No reason set.'

    const AFKsSchema = await Schemas.AFKs.findOne({ guild: interaction.guildId, user: interaction.user.id })

    if (AFKsSchema) {

      AFKsSchema.reason = reason

      await AFKsSchema.save()

    } else await new Schemas.AFKs({
      guild: interaction.guildId,
      user: interaction.user.id,
      reason 
    }).save()

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Utils.PhaseColour.Primary)
        .setDescription(reason)
        .setTitle(Utils.PhaseEmoji.Success + 'Updated your AFK status')
      ],
    })
    
  }
})