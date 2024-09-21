import { DiscordAPIError } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"
import { moduleVariables } from "@repo/config/phase/variables.ts"

import { CustomMessageBuilder } from "~/lib/builders/message"
import { db } from "~/lib/db"

import { generateWelcomeCard } from "~/images/welcome"

import type { Variable } from "@repo/config/phase/variables.ts"
import type { GuildMember, GuildTextBasedChannel } from "discord.js"

export default new BotEventBuilder()
  .setName("guildMemberAdd")
  .setExecute(async (client, member) => {
    const guildDoc = client.store.guilds.get(member.guild.id)
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

    await channel.sendTyping()

    let description = moduleConfig.message

    const variables = moduleVariables[ModuleId.WelcomeMessages].filter(
      (variable) => description.includes(`{${variable.name}}`),
    )

    for (const variable of variables) {
      description = replaceVariable(description, variable, member)
    }

    const welcomeCard = moduleConfig.card.enabled
      ? await (await generateWelcomeCard({ client, member })).toAttachment()
      : null

    const message = new CustomMessageBuilder()

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

function replaceVariable(
  newDescription: string,
  variable: Variable,
  member: GuildMember,
) {
  switch (variable.name) {
    case "memberCount":
      return newDescription.replaceAll(
        `{${variable.name}}`,
        member.guild.memberCount + "",
      )

    case "username":
      return newDescription.replaceAll(
        `{${variable.name}}`,
        member.user.username,
      )

    default:
      return newDescription
  }
}
