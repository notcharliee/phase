import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


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

    const AFKSchema = await Schemas.AFKSchema.findOne({ user: interaction.user.id })

    if (AFKSchema) {
      AFKSchema.reason = reason
      await AFKSchema.save()
    } else await new Schemas.AFKSchema({
      user: interaction.user.id,
      reason,
    }).save()

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Utils.PhaseColour.Primary)
        .setDescription(reason)
        .setTitle('AFK Status Changed')
      ],
    })
  }
})