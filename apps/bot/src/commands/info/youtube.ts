import { BotCommandBuilder, botCommand } from "phasebot"
import { PhaseColour, errorMessage, formatNumber } from "~/utils"
import { env } from "~/env"
import { google } from "googleapis"
import { EmbedBuilder } from "discord.js"
import axios from "axios"

export default botCommand(
  new BotCommandBuilder()
    .setName("youtube")
    .setDescription("Get info about a YouTube video.")
    .addStringOption((option) =>
      option
        .setName("video")
        .setDescription("The video URL.")
        .setRequired(true),
    ),
  async (client, interaction) => {
    await interaction.deferReply()

    const youtube = google.youtube("v3")

    const videoUrl = interaction.options.getString("video", true)
    let videoId: string = ""

    if (videoUrl.includes("v=")) {
      videoId = videoUrl.split("v=")[1].split("&")[0]
    } else if (videoUrl.includes(".be/")) {
      videoId = videoUrl.split(".be/")[1].split("?")[0]
    } else {
      return interaction.editReply(
        errorMessage({
          title: "Video Not Found",
          description: `Could not find YouTube video with url \`${videoUrl}\`.`,
        }),
      )
    }

    try {
      const videoResponse = await youtube.videos.list({
        key: env.API_YOUTUBE,
        part: ["snippet"],
        id: [videoId],
      })

      if (!videoResponse.data.items) {
        return interaction.editReply(
          errorMessage({
            title: "Video Not Found",
            description: `Could not find YouTube video with url \`${videoUrl}\`.`,
          }),
        )
      }

      const likeData = (
        await axios.get<YoutTubeDislikeAPI>(
          `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`,
        )
      ).data

      const video = videoResponse.data.items[0].snippet
      if (!video) {
        return interaction.editReply(
          errorMessage({
            title: "Video Not Found",
            description: `Could not find YouTube video with url \`${videoUrl}\`.`,
          }),
        )
      }

      const videoThumbnail = video.thumbnails?.maxres?.url

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription(
              `**Published:** <t:${Date.parse(`${video.publishedAt}`) / 1000}:R>\n**Views:** ${formatNumber(likeData.viewCount)}\n**Likes:** ${formatNumber(likeData.likes)}\n**Dislikes:** ${formatNumber(likeData.dislikes)}\n\n**Description:**\n${video.description}`,
            )
            .setImage(videoThumbnail ?? null)
            .setTitle(`${video.channelTitle} - ${video.title}`)
            .setURL(videoUrl),
        ],
      })
    } catch {
      return interaction.editReply(
        errorMessage({
          title: "Video Not Found",
          description: `Could not find YouTube video with url \`${videoUrl}\`.`,
        }),
      )
    }
  },
)

type YoutTubeDislikeAPI = {
  id: string
  dateCreated: string
  likes: number
  dislikes: number
  rating: number
  viewCount: number
  deleted: boolean
}
