import * as React from "react"

import { createEditor } from "slate"

import { AllowedChannelTypes } from "~/components/channel-icons"
import { withPlugins } from "~/components/richtext/shared/plugins"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { ChannelType } from "@discordjs/core/http-only"
import type { RichTextFlags } from "~/components/richtext/shared/types"
import type { GuildElementData } from "~/types/slate"

export function useEditor() {
  return React.useMemo(() => withPlugins(createEditor()), [])
}

export function useGuildData(flags: RichTextFlags) {
  const dashboard = useDashboardContext(!flags.channels && !flags.mentions)

  const guildData: GuildElementData = React.useMemo(
    () => ({
      channels:
        dashboard?.guild.channels
          .filter(
            (channel) =>
              AllowedChannelTypes.GuildCategory !==
                (channel.type as ChannelType) &&
              Object.values(AllowedChannelTypes).includes(channel.type),
          )
          .map((channel) => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
          })) ?? [],
      mentions: [
        {
          id: "everyone",
          name: "everyone",
          type: "everyone",
          colour: "#f8f8f8",
        },
        {
          id: "here",
          name: "here",
          type: "here",
          colour: "#f8f8f8",
        },
        ...(dashboard?.guild.roles.map((role) => ({
          id: role.id,
          name: role.name,
          type: "role" as const,
          colour:
            role.color !== 0
              ? `#${role.color.toString(16).padStart(6, "0")}`
              : "#f8f8f8",
        })) ?? []),
      ],
    }),
    [dashboard?.guild.channels, dashboard?.guild.roles],
  )

  return guildData
}
