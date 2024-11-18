import { ChannelType } from "@discordjs/core/http-only"
import {
  Folder,
  Hash,
  Image,
  MessagesSquare,
  Newspaper,
  Volume2,
} from "lucide-react"

import type { APIChannel } from "@discordjs/core/http-only"
import type { LucideProps } from "lucide-react"

export const AllowedChannelTypes = {
  GuildAnnouncement: ChannelType.GuildAnnouncement,
  GuildCategory: ChannelType.GuildCategory,
  GuildForum: ChannelType.GuildForum,
  GuildMedia: ChannelType.GuildMedia,
  GuildStageVoice: ChannelType.GuildStageVoice,
  GuildText: ChannelType.GuildText,
  GuildVoice: ChannelType.GuildVoice,
} as const

export type AllowedChannelType =
  (typeof AllowedChannelTypes)[keyof typeof AllowedChannelTypes]

export type AllowedAPIChannel = APIChannel & { type: AllowedChannelType }

export const channelIcons: Record<AllowedChannelType, React.FC<LucideProps>> = {
  [ChannelType.GuildAnnouncement]: Newspaper,
  [ChannelType.GuildCategory]: Folder,
  [ChannelType.GuildForum]: MessagesSquare,
  [ChannelType.GuildMedia]: Image,
  [ChannelType.GuildStageVoice]: Volume2,
  [ChannelType.GuildText]: Hash,
  [ChannelType.GuildVoice]: Volume2,
}

export interface ChannelIconProps extends LucideProps {
  channelType: AllowedChannelType
}

export function ChannelIcon({ channelType, ...props }: ChannelIconProps) {
  const ChannelIcon = channelIcons[channelType]
  return <ChannelIcon {...props} />
}
