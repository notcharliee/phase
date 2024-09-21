import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import dedent from "dedent"
import { google } from "googleapis"

import { PhaseColour } from "~/lib/enums"
import { env } from "~/lib/env"
import { BotError } from "~/lib/errors"
import { formatNumber } from "~/lib/utils"

interface YoutTubeDislikeAPIResponse {
  id: string
  dateCreated: string
  likes: number
  dislikes: number
  rating: number
  viewCount: number
  deleted: boolean
}

export default new BotCommandBuilder()
  .setName("youtube")
  .setDescription("Gives you info about a YouTube video.")
  .addStringOption((option) =>
    option.setName("video").setDescription("The video URL.").setRequired(true),
  )
  .setExecute(async (interaction) => {
    const youtube = google.youtube("v3")

    const videoUrl = interaction.options.getString("video", true)
    let videoId = ""

    if (videoUrl.includes("v=")) {
      videoId = videoUrl.split("v=")[1]!.split("&")[0]!
    } else if (videoUrl.includes(".be/")) {
      videoId = videoUrl.split(".be/")[1]!.split("?")[0]!
    } else {
      void interaction.reply(
        new BotError("Could not find a YouTube video with that URL.").toJSON(),
      )

      return
    }

    const videoResponse = await youtube.videos
      .list({
        key: env.API_YOUTUBE,
        part: ["snippet"],
        id: [videoId],
      })
      .catch(() => null)

    if (!videoResponse?.data.items?.[0]!.snippet) {
      void interaction.reply(
        new BotError("Could not find a YouTube video with that URL.").toJSON(),
      )

      return
    }

    const video = videoResponse.data.items[0].snippet
    const videoThumbnail = video.thumbnails?.maxres?.url

    const ratingsData = await fetch(
      "https://returnyoutubedislikeapi.com/votes?videoId=" + videoId,
    )
      .catch(() => null)
      .then((res) => res?.json() as Promise<YoutTubeDislikeAPIResponse | null>)

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle(`${video.channelTitle} - ${video.title}`)
          .setURL(videoUrl)
          .setDescription(
            dedent`
              **Published:** <t:${Date.parse(`${video.publishedAt}`) / 1000}:R>
              **Views:** ${formatNumber(ratingsData?.viewCount ?? 0)}
              **Likes:** ${formatNumber(ratingsData?.likes ?? 0)}
              **Dislikes:** ${formatNumber(ratingsData?.dislikes ?? 0)}
              
              **Description:**
              ${video.description}
            `,
          )
          .setImage(videoThumbnail ?? null),
      ],
    })
  })
