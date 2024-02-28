import { botEvent } from "phase.js"
import { PhaseColour } from "~/utils"
import { GuildSchema } from "@repo/schemas"
import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"

export default botEvent("guildMemberAdd", async (client, member) => {
  const guildSchema = await GuildSchema.findOne({ id: member.guild.id })
  if (!guildSchema || !guildSchema.modules.WelcomeMessages?.enabled) return

  const moduleData = guildSchema.modules.WelcomeMessages

  const channel = client.channels.cache.get(moduleData.channel) as
    | GuildTextBasedChannel
    | undefined

  if (!channel) {
    guildSchema.modules.WelcomeMessages.enabled = false
    guildSchema.markModified("modules")
    guildSchema.save()

    return
  }

  const avatar = member.user.displayAvatarURL({ extension: "png", size: 256 })
  const username = member.user.globalName ?? member.user.username
  const membercount = member.guild.memberCount.toString()
  const background = moduleData.card.background

  let card: string | URL | null = moduleData.card.enabled
    ? new URL("https://phasebot.xyz/api/image/welcome.png")
    : null

  if (card) {
    card.searchParams.append("avatar", avatar)
    card.searchParams.append("membercount", membercount)

    if (background) card.searchParams.append("background", background)

    card = card.toString()
  }

  const message = moduleData.message
    .replaceAll("username", username)
    .replaceAll("membercount", membercount)

  channel.send({
    content: moduleData.mention ? `${member}` : undefined,
    embeds: [
      new EmbedBuilder()
        .setDescription(message.length ? message : null)
        .setImage(card)
        .setColor(PhaseColour.Primary),
    ],
  })
})
