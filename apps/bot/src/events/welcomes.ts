import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { botEvent } from "phasebot"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default botEvent("guildMemberAdd", async (client, member) => {
  const guildSchema = await db.guilds.findOne({ id: member.guild.id })
  if (!guildSchema || !guildSchema.modules?.WelcomeMessages?.enabled) return

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

  let card: string | null = moduleData.card.enabled
    ? "https://phasebot.xyz/api/image/welcome.png"
    : null

  if (card) {
    const url = new URL(card)

    url.searchParams.append("avatar", avatar)
    url.searchParams.append("username", username)
    url.searchParams.append("membercount", membercount)

    if (background) url.searchParams.append("background", background)

    card = url.toString()
  }

  const message = moduleData.message
    .replaceAll("{username}", username)
    .replaceAll("{membercount}", membercount)

  if (message.length) {
    channel.send({
      content: moduleData.mention ? `${member}` : undefined,
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: "New Member", iconURL: avatar })
          .setDescription(message)
          .setImage(card)
          .setColor(PhaseColour.Primary),
      ],
    })
  } else if (!message.length && card) {
    await channel.sendTyping()

    const attachment = await fetch(card).then((res) =>
      res.arrayBuffer().then((ab) => ab),
    )

    channel.send({
      content: moduleData.mention ? `${member}` : undefined,
      files: [Buffer.from(attachment)],
    })
  } else {
    guildSchema.modules.WelcomeMessages.enabled = false
    guildSchema.markModified("modules")
    guildSchema.save()

    return
  }
})
