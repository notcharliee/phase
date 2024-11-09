import { PermissionFlagsBits } from "discord.js"

import type { GuildBasedChannel, GuildTextBasedChannel } from "discord.js"

export function isSendableChannel(
  channel: GuildBasedChannel,
): channel is GuildTextBasedChannel {
  const requiredPermissions = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
  ]

  return (
    channel.isSendable() &&
    channel.permissionsFor(channel.guild.members.me!).has(requiredPermissions)
  )
}
