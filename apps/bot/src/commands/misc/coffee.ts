import * as Discord from 'discord.js'
import * as Utils from '@repo/utils/bot'
import * as Schemas from '@repo/utils/schemas'


export default Utils.Functions.clientSlashCommand({
	data: new Discord.SlashCommandBuilder()
		.setName('coffee')
		.setDescription('Buy me a coffee!'),
	async execute(client, interaction) {

		interaction.reply({
			components: [
				new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
					.setComponents(
						new Discord.ButtonBuilder()
							.setLabel('Buy me a coffee!')
							.setStyle(Discord.ButtonStyle.Link)
							.setURL(Utils.Enums.PhaseURL.PhaseCoffee)
					)
			],
			embeds: [
				new Discord.EmbedBuilder()
					.setColor(Utils.Enums.PhaseColour.Primary)
					.setDescription('Support the development of Phase and buy me (the developer) a cup of coffee! <3')
					.setTitle(Utils.Enums.PhaseEmoji.Coffee + 'Buy me a coffee!')
			],
		})

	}
})