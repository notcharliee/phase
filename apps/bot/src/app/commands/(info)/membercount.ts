import { BotCommandBuilder } from "@phasejs/builders"

import { MessageBuilder } from "~/structures/builders"

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

    return await interaction.reply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setTitle("Member Count")
          .setColor("Primary")
          .setDescription(
            `
              **Total:** ${total}
              **Online:** ${online} (${percentage(online)})
              **Offline:** ${offline} (${percentage(offline)})
            `,
          )
      }),
    )
  })
