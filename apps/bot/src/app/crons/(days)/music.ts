import { BotCronBuilder } from "phasebot/builders"

export default new BotCronBuilder()
  .setPattern("0 0 * * *")
  .setExecute(async (client) => {
    client.music.youtube.cookies = await client.music.getCookies(true)
  })
