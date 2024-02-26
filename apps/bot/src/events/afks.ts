import { AFKSchema } from "@repo/schemas"
import { EmbedBuilder } from "discord.js"
import { botEvent } from "phase.js"
import { PhaseColour } from "~/utils"

export default botEvent("messageCreate", async (client, message) => {
  if (!message.inGuild()) return

  const afkSchema = await AFKSchema.findOne({ user: message.author.id })

  if (afkSchema) {
    await afkSchema.deleteOne()

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription("Your AFK status has been updated to **false**.")
          .setTitle("AFK Status Changed"),
      ],
    })
  } else {
    const mentionedMembers = message.mentions.users.map((user) => user.id)
    if (!mentionedMembers) return

    for (const mentionedMember of mentionedMembers) {
      const mentionAFKSchema = await AFKSchema.findOne({
        user: mentionedMember,
      })

      if (mentionAFKSchema) {
        const memberName = await message.guild.members.fetch(mentionedMember)

        message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setDescription(mentionAFKSchema.reason)
              .setTitle(`${memberName.displayName} is currently AFK`),
          ],
        })
      }
    }
  }
})
