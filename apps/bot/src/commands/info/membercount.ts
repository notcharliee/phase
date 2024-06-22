import { BotCommandBuilder } from "phasebot/builders"

export default new BotCommandBuilder()
  .setName("membercount")
  .setDescription("Get the server membercount.")
  .setDMPermission(false)
  .setExecute(async (interaction) => {
    const guild = interaction.guild!

    const total = guild.memberCount
    const online = guild.approximatePresenceCount ?? 0
    const offline = total - online

    const percentage = (val: number) => `${((val / total) * 100).toFixed(1)}%`

    interaction.reply(
      `**Total:** ${total}\n**Online:** ${online} (${percentage(online)})\n**Offline:** ${offline} (${percentage(offline)})`,
    )
  })
