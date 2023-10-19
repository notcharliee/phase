import * as Discord from 'discord.js'
import * as Utils from 'utils'


export default Utils.Functions.clientSlashCommand({
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

    const AFKsSchema = await Utils.Schemas.AFKs.findOne({ guild: interaction.guildId, user: interaction.user.id })

    if (AFKsSchema) {

      AFKsSchema.reason = reason

      await AFKsSchema.save()

    } else await new Utils.Schemas.AFKs({
      guild: interaction.guildId,
      user: interaction.user.id,
      reason 
    }).save()

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Utils.Enums.PhaseColour.Primary)
        .setDescription(reason)
        .setTitle(Utils.Enums.PhaseEmoji.Success + 'Updated your AFK status')
      ],
    })
    
  }
})