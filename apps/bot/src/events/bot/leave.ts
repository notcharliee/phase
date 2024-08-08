import { EmbedBuilder } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import dedent from "dedent"

import { alertWebhook } from "~/lib/clients/webhooks/alert"
import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default new BotEventBuilder()
  .setName("guildDelete")
  .setExecute(async (_, guild) => {
    void alertWebhook.send({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Bot Removed")
          .setThumbnail(guild.iconURL())
          .setTimestamp()
          .setDescription(
            dedent`
              **Name:** \`${guild.name}\`
              **ID:** \`${guild.id}\`
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
