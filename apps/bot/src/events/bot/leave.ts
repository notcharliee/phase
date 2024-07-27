import { EmbedBuilder } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import dedent from "dedent"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { formatDate } from "~/lib/utils"
import { alertWebhook } from "~/lib/webhooks/alert"

export default new BotEventBuilder()
  .setName("guildDelete")
  .setExecute(async (client, guild) => {
    const guildDoc = await db.guilds.findOne({ id: guild.id })

    const botJoinDate = guildDoc?._id.getTimestamp()
    const relativeJoinDate = botJoinDate
      ? formatDate(new Date(botJoinDate))
      : "unknown"

    void alertWebhook.send({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Bot Removed")
          .setThumbnail(guild.iconURL())
          .setDescription(
            dedent`
              **${guild.name}** \`(${guild.id})\` has removed the bot. It was in the server for **${relativeJoinDate}**.

              This decreases the total server count to **${client.application!.approximateGuildCount}**.
            `,
          ),
      ],
    })

    void Promise.all([
      db.guilds.deleteOne({ id: guild.id }),
      db.giveaways.deleteMany({ guild: guild.id }),
      db.levels.deleteMany({ guild: guild.id }),
      db.otps.deleteMany({ guildId: guild.id }),
      db.reminders.deleteMany({ guild: guild.id }),
      db.tags.deleteMany({ guild: guild.id }),
    ])
  })
