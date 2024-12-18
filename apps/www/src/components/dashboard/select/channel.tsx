import * as React from "react"

import { ChannelType } from "@discordjs/core/http-only"

import {
  Combobox,
  ComboboxContent,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/combobox"
import { AllowedChannelTypes, channelIcons } from "~/components/channel-icons"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { ComboboxItem } from "@repo/ui/combobox"
import type { Arrayable, Optional } from "~/types/utils"

export interface SelectChannelProps<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
> {
  channelType?: keyof typeof AllowedChannelTypes
  placeholder?: string
  multiselect?: TMultiselect
  disabled?: boolean
  name: string
  value: TValue
  onValueChange: (value: TValue) => void
}

export function SelectChannel<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
>({
  disabled,
  channelType = "GuildText",
  placeholder = "Select a channel",
  ...props
}: SelectChannelProps<TMultiselect, TValue>) {
  const dashboard = useDashboardContext()

  const items = React.useMemo(() => {
    const categories = dashboard.guild.channels
      .filter(
        (channel) =>
          (channel.type as ChannelType) === ChannelType.GuildCategory,
      )
      .sort((a, b) => a.position + b.position)

    const items: ComboboxItem[] = []

    if (channelType === "GuildCategory") {
      items.push(
        ...categories.map((category) => ({
          label: category.name,
          value: category.id,
          iconName: channelIcons[category.type],
        })),
      )
    } else {
      for (const category of categories) {
        const channels = dashboard.guild.channels
          .filter(
            (channel) =>
              channel.parentId === category.id &&
              AllowedChannelTypes[channelType] === channel.type,
          )
          .sort((a, b) => a.position + b.position)

        items.push(
          ...channels.map(
            (channel): ComboboxItem => ({
              label: channel.name,
              value: channel.id,
              group: category.name,
              iconName: channelIcons[channel.type],
            }),
          ),
        )
      }
    }

    return items
  }, [channelType, dashboard.guild.channels])

  return (
    <Combobox>
      <ComboboxTrigger disabled={disabled}>
        <ComboboxValue placeholder={placeholder} />
      </ComboboxTrigger>
      <ComboboxContent items={items} {...props} />
    </Combobox>
  )
}
