import { BotCronBuilder } from "phasebot/builders"

import { YouTubePlugin } from "@distube/youtube"

import { getYouTubeCookies } from "~/lib/distube"

/**
 * Refreshes the youtube cookies every day at midnight so they don't expire.
 */
export default new BotCronBuilder()
  .setPattern("0 0 * * *") // every day at midnight
  .setExecute(async (client) => {
    const youtubePlugin = client.distube.plugins.find(
      (plugin) => plugin instanceof YouTubePlugin,
    )!

    youtubePlugin.cookies = await getYouTubeCookies(true)
  })
