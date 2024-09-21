import { BotCronBuilder } from "phasebot/builders"

import { getYouTubeCookies } from "~/lib/music"

export default new BotCronBuilder()
  .setPattern("0 0 * * *")
  .setExecute(async (client) => {
    client.music.youtube.cookies = await getYouTubeCookies(true)
  })
