import type { GuildMember } from "discord.js"

export interface Song {
  name: string
  url: string
  streamUrl: string
  thumbnail: string
  duration: number
  formattedDuration: string
  isLive: boolean
  submittedAt: Date
  submittedBy: GuildMember
}

export interface CurrentSong extends Song {
  playbackDuration: number
  formattedPlaybackDuration: string
}