import { ActivityType } from "discord.js"
import { BotCronBuilder } from "phasebot/builders"

import { cache } from "~/lib/cache"

export default new BotCronBuilder()
  .setPattern("*/30 * * * * *") // every 30 seconds
  .setExecute(async (client) => {
    const botConfig = (await cache.configs.get("bot"))!

    const statusType = botConfig.status.type
    const statusText = botConfig.status.text

    const botStatusType = client.user.presence.status
    const botStatusText = client.user.presence.activities[0]?.state

    if (botStatusType !== statusType) {
      client.user.setStatus(statusType)
      console.log(
        `Bot status type set to '${statusType}' from '${botStatusType}'`,
      )
    }

    if (botStatusText !== statusText) {
      client.user.setActivity(statusText, { type: ActivityType.Custom })
      console.log(
        `Bot status text set to '${statusText}' from '${botStatusText}'`,
      )
    }
  })
