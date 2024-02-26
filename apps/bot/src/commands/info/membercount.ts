import { botCommand, BotCommandBuilder } from "phase.js"
import { EmbedBuilder } from "discord.js"
import { PhaseColour } from "~/utils"

export default botCommand(
  new BotCommandBuilder()
    .setName("membercount")
    .setDescription("Get the server membercount.")
    .setDMPermission(false),
  (client, interaction) => {
    const guild = interaction.guild!

    const total = guild.memberCount
    const online = guild.approximatePresenceCount ?? 0
    const offline = total - online

    const p = (val: number) => `${((val / total) * 100).toFixed(1)}%`

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            iconURL: guild.iconURL() ?? undefined,
            name: guild.name,
          })
          .setDescription(
            `**Total:** ${total}\n**Online:** ${online} (${p(online)})\n**Offline:** ${offline} (${p(offline)})`,
          )
          .setColor(PhaseColour.Primary),
      ],
    })
  },
)
