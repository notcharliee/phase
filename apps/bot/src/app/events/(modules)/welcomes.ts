import { DiscordAPIError } from "discord.js"
import { BotEventBuilder } from "@phasejs/core/builders"

import { ModuleDefinitions, ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"

import { generateWelcomeCard } from "~/images/welcome"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

export default new BotEventBuilder()
  .setName("guildMemberAdd")
  .setExecute(async (client, member) => {
    const guildDoc = client.stores.guilds.get(member.guild.id)
    const moduleConfig = guildDoc?.modules?.[ModuleId.WelcomeMessages]
    const moduleDefinition = ModuleDefinitions[ModuleId.WelcomeMessages]

    if (!guildDoc || !moduleConfig?.enabled) return

    const channel = member.guild.channels.cache.get(moduleConfig.channel)

    if (
      !channel?.isSendable() ||
      !channel
        .permissionsFor(client.user!)
        ?.has(["ViewChannel", "SendMessages"])
    ) {
      return void db.guilds.updateOne(
        { id: guildDoc.id },
        { [`modules.${ModuleId.WelcomeMessages}.enabled`]: false },
      )
    }

    await channel.sendTyping().catch(() => null)

    const description = moduleDefinition.variables.parse(
      moduleConfig.message,
      member,
    )

    const welcomeCard = moduleConfig.card.enabled
      ? (await generateWelcomeCard(client, member)).toAttachment()
      : null

    const message = new MessageBuilder()

    if (moduleConfig.mention) {
      message.setContent(`<@${member.id}>`)
    }

    if (welcomeCard) {
      welcomeCard.setName(`welcome-card-${member.id}.png`)
      message.setFiles(welcomeCard)
    }

    message.setEmbeds((embed) => {
      return embed
        .setColor("Primary")
        .setAuthor({
          name: "New Member",
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(description.length ? description : null)
        .setImage(welcomeCard)
    })

    try {
      await channel.send(message)
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === 50001) {
        return void db.guilds.updateOne(
          { id: guildDoc.id },
          { [`modules.${ModuleId.WelcomeMessages}.enabled`]: false },
        )
      } else {
        console.error(
          `Failed to send welcome message to channel ${channel.id} in guild ${guildDoc.id}:`,
        )
        console.error(error)
      }
    }
  })
