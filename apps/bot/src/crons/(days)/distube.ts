import { BotCronBuilder } from "phasebot/builders"

import { getYouTubeCookies } from "~/lib/distube"

/**
 * Refreshes the youtube cookies every day at midnight so they don't expire.
 */
export default new BotCronBuilder()
  .setPattern("0 0 * * *")
  .setExecute(async (client) => {
    client.music.youtube.cookies = await getYouTubeCookies(true)
  })
