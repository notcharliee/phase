import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientEvent({
  name: 'messageCreate',
  async execute(client, message) {

    if (!message.inGuild() || message.author.bot) return
    if (!client.user) return

    const levelsSchema = await Schemas.Levels.findOne({ guild: message.guildId })
    if (!levelsSchema) return

    const userIndex = levelsSchema.levels.findIndex(u => u.id == message.author.id)
    const user = levelsSchema.levels[userIndex]


    if (userIndex != -1) {

      const currentLevel = user.level
      const currentXp = user.xp
      const currentTarget = user.target
      const xpToAdd = Math.floor(Math.random() * 70) + 5

      if (currentXp! + xpToAdd >= currentTarget!) levelUp(message.author.id, currentLevel! + 1, 0, currentTarget! + 500)
      else addXp(message.author.id, currentLevel!, currentXp! + xpToAdd, currentTarget!)

    } else createUser(message.author.id, 0, Math.floor(Math.random() * 70) + 5, 1000)


    function createUser(id: string, level: number, xp: number, target: number) {

      levelsSchema!.levels.push({ id, level, xp, target })
      levelsSchema!.save()

    }

    function addXp(id: string, level: number, xp: number, target: number) {

      levelsSchema!.levels[userIndex] = { id, level, xp, target }
      levelsSchema!.save()

    }

    function levelUp(id: string, level: number, xp: number, target: number) {

      levelsSchema!.levels[userIndex] = { id, level, xp, target }
      levelsSchema!.save()

      const levelUpMessage = levelsSchema!.message
        .replaceAll('{member}', `${message.author}`)
        .replaceAll('{member.name}', `${message.author.username}`)
        .replaceAll('{member.server}', `${message.guild!.name}`)
        .replaceAll('{member.level}', `${level}`)
        .replaceAll('{member.target}', `${target}`)

      if (levelsSchema!.dmsChannel) {

        message.author.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(levelUpMessage)
              .setFooter({ text: `Sent from ${message.guild!.name}` })
              .setTitle('You levelled up!')
          ]
        }).catch((error) => {

          Utils.Functions.alertDevs({
            title: `Message Send Failure`,
            description: `**Could not send DM**\n${error}\n\n**Message Data**\nContent: \`${levelUpMessage}\`\nType: \`Embed\`\nRecipient: \`${message.author.id}\``,
            type: 'warning'
          })

        })

      } else if (levelsSchema!.msgChannel) {

        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle('You levelled up!')
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(levelUpMessage)
          ]
        }).catch((error) => {

          Utils.Functions.alertDevs({
            title: `Message Send Failure`,
            description: `**Could not send reply**\n${error}\n\n**Message Data**\nContent: \`${levelUpMessage}\`\nType: \`Embed\`\nRecipient: \`${message.author.id}\``,
            type: 'warning'
          })

        })

      } else if (levelsSchema!.setChannel) {

        const channel = client.channels.cache.get(levelsSchema!.setChannel)
        if (!channel || !channel.isTextBased()) return

        channel.send({
          content: `${message.author}`,
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.Enums.PhaseColour.Primary)
              .setDescription(levelUpMessage)
              .setTitle('You levelled up!')
          ]
        }).catch((error) => {

          Utils.Functions.alertDevs({
            title: `Message Send Failure`,
            description: `**Could not send message**\n${error}\n\n**Message Data**\nContent: \`${levelUpMessage}\`\nType: \`Embed\`\nChannel: \`${channel!.id}\``,
            type: 'warning'
          })

        })

      }


      if (levelsSchema!.roles) {

        for (const roleObject of levelsSchema!.roles) {

          if (!roleObject.role || !roleObject.level) continue

          if (roleObject.level == level) {

            const role = message.guild!.roles.cache.get(roleObject.role)
            if (!role) return

            message.guild!.members.addRole({ user: message.author.id, role, reason: 'Applied level up role to member.' })

          }

        }

      }

    }

  }
})