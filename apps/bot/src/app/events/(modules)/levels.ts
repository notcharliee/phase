import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"
import { variables } from "@repo/utils/variables"

import { db } from "~/lib/db"
import { isSnowflake } from "~/lib/utils"

import { CustomMessageBuilder } from "~/structures/CustomMessageBuilder"

export default new BotEventBuilder()
  .setName("messageCreate")
  .setExecute(async (client, message) => {
    if (!message.inGuild() || message.author.bot) return

    const guildDoc = client.store.guilds.get(message.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.Levels]

    if (!moduleConfig?.enabled) return

    const levelDoc =
      (await db.levels.findOne({
        guild: message.guildId,
        user: message.author.id,
      })) ??
      (await db.levels.create({
        guild: message.guildId,
        user: message.author.id,
        level: 0,
        xp: 0,
      }))

    const currentLevel = levelDoc.level
    const currentXP = levelDoc.xp
    const currentTarget = 500 * (levelDoc.level + 1)

    const guaranteedXP = 5
    const randomXP = Math.random() * 70

    const xpToAdd = Math.floor(randomXP + guaranteedXP)

    if (currentXP + xpToAdd <= currentTarget) {
      levelDoc.level = currentLevel
      levelDoc.xp = currentXP + xpToAdd
    } else {
      levelDoc.level += 1
      levelDoc.xp = 0

      const levelUpMessage = new CustomMessageBuilder()

      if (moduleConfig.mention) {
        levelUpMessage.setContent(`<@${message.author.id}>`)
      }

      levelUpMessage.setEmbeds((embed) => {
        embed.setColor("Primary")
        embed.setTitle("You levelled up!")

        if (moduleConfig.message.length) {
          embed.setDescription(
            variables.modules[ModuleId.Levels].parse(
              moduleConfig.message,
              message.author,
              levelDoc,
            ),
          )
        }

        if (moduleConfig.channel === "dm") {
          embed.setFooter({ text: `Sent from ${message.guild.name}` })
        }

        return embed
      })

      try {
        if (moduleConfig.channel === "dm") {
          await message.author.send(levelUpMessage)
        } else if (moduleConfig.channel === "reply") {
          await message.reply(levelUpMessage)
        } else if (isSnowflake(moduleConfig.channel)) {
          const channel = message.guild.channels.cache.get(moduleConfig.channel)
          if (channel?.isSendable()) await channel.send(levelUpMessage)
        }
      } catch (error) {
        console.error(`[Levels] Failed to send level up message:`)
        console.error(error)
      }

      try {
        const rolesToAdd = moduleConfig.roles.reduce<string[]>(
          (acc, { level, role }) => {
            if (level === currentLevel) acc.push(role)
            return acc
          },
          [],
        )

        if (rolesToAdd.length) {
          await Promise.all(
            rolesToAdd.map((role) =>
              message.guild.members.addRole({ user: message, role }),
            ),
          )
        }
      } catch (error) {
        console.error(`[Levels] Failed to add level up roles:`)
        console.error(error)
      }
    }

    return await levelDoc.save()
  })
