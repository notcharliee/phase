import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"

export default new BotCommandBuilder()
  .setName("membercount")
  .setDescription("Gives you the server membercount.")
  .setDMPermission(false)
  .setExecute(async (interaction) => {
    const guild = interaction.guild!

    const total = guild.memberCount
    const online = guild.approximatePresenceCount ?? 0
    const offline = total - online

    const percentage = (val: number) => `${((val / total) * 100).toFixed(1)}%`

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Member Count")
          .setDescription(
            dedent`
              **Total:** ${total}
              **Online:** ${online} (${percentage(online)})
              **Offline:** ${offline} (${percentage(offline)})
            `,
          )
          .setColor(PhaseColour.Primary),
      ],
    })
  })
