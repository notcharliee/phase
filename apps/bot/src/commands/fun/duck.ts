import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('duck')
    .setDescription('Finds a random picture of a duck.'),
  async execute(client, interaction) {

    await interaction.deferReply()

    const apiResponse = await fetch('https://random-d.uk/api/random')
    const apiJsonResponse: ApiJsonResponse = await apiResponse.json()

    if (apiResponse.ok) {

      const apiHostname = new URL(apiResponse.url).hostname
      const apiImageUrl = apiJsonResponse.url

      interaction.editReply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Utils.PhaseColour.Primary)
            .setFooter({ text: `https://${apiHostname}` })
            .setImage(apiImageUrl)
            .setTitle('Quack!')
        ]
      })

    } else {

      Utils.alertDevs({
        title: `Command Failure: /${this.data.name}`,
        description: `**Error ${apiResponse.status}**\n${apiResponse.statusText}\n\n**Interaction Data**\nGuild: \`${interaction.guildId}\`\nUser: \`${interaction.user}\``,
        type: 'warning'
      })

      Utils.clientError<true>(
        interaction,
        'Well, this is awkward..',
        Utils.PhaseError.Unknown
      )

    }

  }
})


type ApiJsonResponse = {
  message: string,
  url: string,
}