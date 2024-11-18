import * as React from "react"

import { ChannelType } from "@discordjs/core/http-only"

import { AllowedChannelTypes, ChannelIcon } from "~/components/channel-icons"
import {
  Combobox,
  ComboboxContent,
  ComboboxTrigger,
  ComboboxValue,
} from "~/components/ui/combobox"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { APIGuildCategoryChannel } from "@discordjs/core/http-only"
import type { AllowedAPIChannel } from "~/components/channel-icons"
import type { ComboboxItem } from "~/components/ui/combobox"
import type { Arrayable, Optional } from "~/types/utils"
import type { LucideProps } from "lucide-react"

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
        (channel): channel is APIGuildCategoryChannel =>
          channel.type === ChannelType.GuildCategory,
      )
      .sort((a, b) => a.position + b.position)

    const items: ComboboxItem[] = []

    if (channelType === "GuildCategory") {
      items.push(
        ...categories.map((category) => ({
          label: category.name,
          value: category.id,
          icon: (props: LucideProps) => (
            <ChannelIcon channelType={category.type} {...props} />
          ),
        })),
      )
    } else {
      for (const category of categories) {
        const channels = dashboard.guild.channels
          .filter(
            (channel): channel is AllowedAPIChannel =>
              channel.parent_id === category.id &&
              AllowedChannelTypes[channelType] === channel.type,
          )
          .sort((a, b) => a.position + b.position)

        items.push(
          ...channels.map((channel) => ({
            label: channel.name,
            value: channel.id,
            group: category.name,
            icon: ({ className }: { className?: string }) => (
              <ChannelIcon channelType={channel.type} className={className} />
            ),
          })),
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
