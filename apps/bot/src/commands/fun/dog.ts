import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('dog')
    .setDescription('Finds a random picture of a dog.'),
  async execute(client, interaction) {

    await interaction.deferReply()

    const apiResponse = await fetch('https://random.dog/woof.json')
    const apiJsonResponse: ApiJsonResponse = await apiResponse.json()

    if (apiResponse.ok) {

      const apiHostname = new URL(apiResponse.url).hostname
      const apiImageUrl = apiJsonResponse.url

      interaction.editReply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Utils.Enums.PhaseColour.Primary)
            .setFooter({ text: `https://${apiHostname}` })
            .setImage(apiImageUrl)
            .setTitle('Woof!')
        ],
      })

    } else {

      Utils.Functions.alertDevs({
        title: `Command Failure: /${this.data.name}`,
        description: `**Error ${apiResponse.status}**\n${apiResponse.statusText}\n\n**Interaction Data**\nGuild: \`${interaction.guildId}\`\nUser: \`${interaction.user}\``,
        type: 'warning'
      })

      Utils.Functions.clientError<true>(
        interaction,
        'Well, this is awkward..',
        Utils.Enums.PhaseError.Unknown
      )

    }

  }
})


type ApiJsonResponse = {
  fileSizeBytes: number,
  url: string,
}