import { BotCronBuilder } from "phasebot/builders"

import { YouTubePlugin } from "@distube/youtube"

import { distubeClient, getCookies } from "~/lib/clients/distube"

/**
 * Refreshes the youtube cookies every day at midnight so they don't expire.
 */
export default new BotCronBuilder()
  .setPattern("0 0 * * *")
  .setExecute(async () => {
    const youtubePlugin = distubeClient.plugins.find(
      (plugin) => plugin instanceof YouTubePlugin,
    )!

    youtubePlugin.cookies = await getCookies(true)
  })
