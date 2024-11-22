import { ActivityType } from "discord.js"
import { BotCronBuilder } from "@phasejs/core/builders"

export default new BotCronBuilder()
  .setPattern("*/30 * * * * *") // every 30 seconds
  .setExecute(async (client) => {
    const statusType = client.stores.config.status.type
    const statusText = client.stores.config.status.text

    const botStatusType = client.user.presence.status
    const botStatusText = client.user.presence.activities[0]?.state

    if (botStatusType !== statusType) {
      client.user.setStatus(statusType)
    }

    if (botStatusText !== statusText) {
      client.user.setActivity(statusText, { type: ActivityType.Custom })
    }
  })
