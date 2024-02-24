import * as Discord from "discord.js"
import * as Utils from "#src/utils/index.js"
import * as Schemas from "@repo/schemas"

export default Utils.clientEvent({
  name: "messageCreate",
  async execute(client, message) {
    if (!message.inGuild() || message.author.bot) return

    const guildSchema = await Schemas.GuildSchema.findOne({
      id: message.guildId,
    })
    const levelModule = guildSchema?.modules.Levels
    if (!levelModule?.enabled) return

    let levelSchema = await Schemas.LevelSchema.findOne({
      guild: message.guildId,
      user: message.author.id,
    })

    if (!levelSchema)
      levelSchema = await new Schemas.LevelSchema({
        guild: message.guildId,
        user: message.author.id,
        level: 0,
        xp: 0,
      }).save()

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

      let levelUpMessage = `${levelModule.message}`

      levelUpMessage = levelUpMessage.replaceAll(
        "{member}",
        `${message.author}`,
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

      switch (levelModule.channel) {
        case "dm":
          {
            message.author.send({
              content: levelModule.mention ? `${message.author}` : undefined,
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(Utils.PhaseColour.Primary)
                  .setDescription(levelUpMessage)
                  .setFooter({ text: `Sent from ${message.guild!.name}` })
                  .setTitle("You levelled up!"),
              ],
            })
          }
          break

        case "reply":
          {
            message.reply({
              content: levelModule.mention ? `${message.author}` : undefined,
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(Utils.PhaseColour.Primary)
                  .setDescription(levelUpMessage)
                  .setTitle("You levelled up!"),
              ],
            })
          }
          break

        default:
          {
            const channel = client.channels.cache.get(
              levelModule.channel,
            ) as Discord.GuildTextBasedChannel
            if (!channel) return

            channel.send({
              content: levelModule.mention ? `${message.author}` : undefined,
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(Utils.PhaseColour.Primary)
                  .setDescription(levelUpMessage)
                  .setTitle("You levelled up!"),
              ],
            })
          }
          break
      }

      for (const levelUpRole of levelModule.roles.filter(
        (role) => role.level === levelSchema!.level,
      )) {
        const role = message.guild.roles.cache.get(levelUpRole.role)
        if (!role) return

        message.guild.members.addRole({
          user: message.author.id,
          role,
        })
      }
    }

    return await levelSchema.save()
  },
})
