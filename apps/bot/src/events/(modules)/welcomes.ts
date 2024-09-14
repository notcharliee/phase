import { EmbedBuilder, GuildTextBasedChannel } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default new BotEventBuilder()
  .setName("guildMemberAdd")
  .setExecute(async (client, member) => {
    const guildDoc = await cache.guilds.get(member.guild.id)
    const moduleConfig = guildDoc?.modules?.[ModuleId.WelcomeMessages]

    if (!guildDoc || !moduleConfig?.enabled) return

    const channel = client.channels.cache.get(moduleConfig.channel) as
      | GuildTextBasedChannel
      | undefined

    if (!channel) {
      return void db.guilds.updateOne(
        { id: guildDoc.id },
        { [`modules.${ModuleId.WelcomeMessages}.enabled`]: false },
      )
    }

    const avatar = member.user.displayAvatarURL({ extension: "png", size: 256 })
    const username = member.user.username
    const membercount = member.guild.memberCount.toString()
    const background = moduleConfig.card.background

    let card: string | null = moduleConfig.card.enabled
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

    const message = moduleConfig.message
      .replaceAll("{username}", username)
      .replaceAll("{membercount}", membercount)

    if (message.length) {
      void channel
        .send({
          content: moduleConfig.mention ? `${member}` : undefined,
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: "New Member", iconURL: avatar })
              .setDescription(message)
              .setImage(card)
              .setColor(PhaseColour.Primary),
          ],
        })
        .catch(() => null)
    } else if (!message.length && card) {
      await channel.sendTyping()

      const attachment = await fetch(card).then((res) =>
        res.arrayBuffer().then((ab) => ab),
      )

      void channel
        .send({
          content: moduleConfig.mention ? `${member}` : undefined,
          files: [Buffer.from(attachment)],
        })
        .catch(() => null)
    } else {
      return void db.guilds.updateOne(
        { id: guildDoc.id },
        { [`modules.${ModuleId.WelcomeMessages}.enabled`]: false },
      )
    }
  })
