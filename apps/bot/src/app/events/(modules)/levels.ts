import { EmbedBuilder } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

import type { GuildTextBasedChannel } from "discord.js"

export default new BotEventBuilder()
  .setName("messageCreate")
  .setExecute(async (client, message) => {
    if (!message.inGuild() || message.author.bot) return

    const guildDoc = client.store.guilds.get(message.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.Levels]

    if (!moduleConfig?.enabled) return

    let levelSchema = await db.levels.findOne({
      guild: message.guildId,
      user: message.author.id,
    })

    if (!levelSchema) {
      levelSchema = await db.levels.create({
        guild: message.guildId,
        user: message.author.id,
        level: 0,
        xp: 0,
      })
    }

    const currentLevel = levelSchema.level
    const currentXP = levelSchema.xp
    const currentTarget = 500 * (levelSchema.level + 1)
    const xpToAdd = Math.floor(Math.random() * 70) + 5

    if (currentXP + xpToAdd <= currentTarget) {
      levelSchema.level = currentLevel
      levelSchema.xp = currentXP + xpToAdd
    } else {
      levelSchema.level += 1
      levelSchema.xp = 0

      let levelUpMessage: string | null = `${moduleConfig.message}`

      levelUpMessage = levelUpMessage.replaceAll(
        "{member}",
        `<@${message.author.id}>`,
      )
      levelUpMessage = levelUpMessage.replaceAll(
        "{member.name}",
        `${message.author.username}`,
      )
      levelUpMessage = levelUpMessage.replaceAll(
        "{member.level}",
        `${levelSchema.level}`,
      )
      levelUpMessage = levelUpMessage.replaceAll(
        "{member.xp}",
        `${levelSchema.xp}`,
      )
      levelUpMessage = levelUpMessage.replaceAll(
        "{member.target}",
        `${500 * (levelSchema.level + 1)}`,
      )

      if (!levelUpMessage.length) levelUpMessage = null

      switch (moduleConfig.channel) {
        case "dm":
          {
            void message.author
              .send({
                content: moduleConfig.mention
                  ? `<@${message.author.id}>`
                  : undefined,
                embeds: [
                  new EmbedBuilder()
                    .setColor(PhaseColour.Primary)
                    .setDescription(levelUpMessage)
                    .setFooter({ text: `Sent from ${message.guild.name}` })
                    .setTitle("You levelled up!"),
                ],
              })
              .catch(() => null)
          }
          break

        case "reply":
          {
            await message.reply({
              content: moduleConfig.mention
                ? `<@${message.author.id}>`
                : undefined,
              embeds: [
                new EmbedBuilder()
                  .setColor(PhaseColour.Primary)
                  .setDescription(levelUpMessage)
                  .setTitle("You levelled up!"),
              ],
            })
          }
          break

        default:
          {
            const channel = client.channels.cache.get(
              moduleConfig.channel,
            ) as GuildTextBasedChannel

            if (!channel) return

            void channel
              .send({
                content: moduleConfig.mention
                  ? `<@${message.author.id}>`
                  : undefined,
                embeds: [
                  new EmbedBuilder()
                    .setColor(PhaseColour.Primary)
                    .setDescription(levelUpMessage)
                    .setTitle("You levelled up!"),
                ],
              })
              .catch(() => null)
          }
          break
      }

      for (const levelUpRole of moduleConfig.roles.filter(
        (role) => role.level === levelSchema.level,
      )) {
        const role = message.guild.roles.cache.get(levelUpRole.role)
        if (!role) return

        await message.guild.members.addRole({
          user: message.author.id,
          role,
        })
      }
    }

    return await levelSchema.save()
  })
