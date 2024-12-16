import { BotCommandBuilder } from "@phasejs/builders"

import { getBasicInfo, validateURL } from "@distube/ytdl-core"

import {
  dateToTimestamp,
  numberToAbbrevition,
  truncateString,
} from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

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
  .addStringOption((option) => {
    return option
      .setName("url")
      .setDescription("The video URL.")
      .setRequired(true)
  })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const url = interaction.options.getString("url", true)

    if (!validateURL(url)) {
      return void interaction.editReply(
        new BotErrorMessage("Invalid YouTube URL."),
      )
    }

    try {
      const { videoDetails } = await getBasicInfo(url)
      const videoRatings = await getRatings(videoDetails.videoId)

      const videoIsLive = videoDetails.isLive
      const videoTitle = `${videoIsLive ? "🔴" : ""} ${videoDetails.title}`
      const videoViews = videoRatings?.viewCount ?? 0
      const videoLikes = videoRatings?.likes ?? 0
      const videoDislikes = videoRatings?.dislikes ?? 0
      const videoPublishedAt = new Date(videoDetails.publishDate)
      const videoDescription = videoDetails.description ?? "N/A"

      void interaction.editReply(
        new MessageBuilder().setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setAuthor({
              name: videoDetails.author.name,
              iconURL: videoDetails.author.avatar,
              url: videoDetails.author.channel_url,
            })
            .setURL(videoDetails.video_url)
            .setTitle(videoTitle)
            .setDescription(
              `
                **Views:** ${numberToAbbrevition(videoViews)}
                **Likes:** ${numberToAbbrevition(videoLikes)}
                **Dislikes:** ${numberToAbbrevition(videoDislikes)}
                **Published:** ${dateToTimestamp(videoPublishedAt)}

                **Description:**
                ${truncateString(videoDescription, 1024)}
              `,
            )
            .setImage(videoDetails.thumbnails.pop()?.url ?? null)
        }),
      )
    } catch {
      return void interaction.editReply(
        new BotErrorMessage("Could not find a video with that URL."),
      )
    }
  })

async function getRatings(videoId: string) {
  const url = new URL("https://returnyoutubedislikeapi.com/votes")

  url.searchParams.set("videoId", videoId)

  const ratingsData = await fetch(url.toString())
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null)

  return ratingsData as Promise<YoutTubeDislikeAPIResponse | null>
}
