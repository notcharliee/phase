import { ChannelType } from "@discordjs/core/http-only"

import { LucideIcon } from "@repo/ui/lucide-icon"

import type { APIChannel } from "@discordjs/core/http-only"
import type { LucideIconName, LucideIconProps } from "@repo/ui/lucide-icon"

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

export const channelIcons: Record<AllowedChannelType, LucideIconName> = {
  [ChannelType.GuildAnnouncement]: "newspaper",
  [ChannelType.GuildCategory]: "folder",
  [ChannelType.GuildForum]: "messages-square",
  [ChannelType.GuildMedia]: "image",
  [ChannelType.GuildStageVoice]: "volume-2",
  [ChannelType.GuildText]: "hash",
  [ChannelType.GuildVoice]: "volume-2",
}

export interface ChannelIconProps extends Omit<LucideIconProps, "name"> {
  channelType: AllowedChannelType
}

export function ChannelIcon({ channelType, ...props }: ChannelIconProps) {
  const iconName = channelIcons[channelType]
  return <LucideIcon name={iconName} {...props} />
}
