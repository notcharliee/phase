"use client"

import { useState } from "react"

import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import { ChannelType } from "discord-api-types/v10"

import { AllowedChannelType, ChannelIcon } from "~/components/channel-icons"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { cn } from "~/lib/utils"

import type { APIGuildChannel, GuildChannelType } from "discord-api-types/v10"
import type { ControllerRenderProps } from "react-hook-form"

interface SelectChannelProps extends ControllerRenderProps {
  channels?: APIGuildChannel<GuildChannelType>[]
  channelType?: GuildChannelType
  categories?: boolean
  placeholder?: string
}

export function SelectChannel({
  channels,
  channelType = ChannelType.GuildText,
  placeholder = `Select a ${channelType === ChannelType.GuildCategory ? "category" : "channel"}`,
  ...props
}: SelectChannelProps) {
  const [key, setKey] = useState(+new Date())

  const dashboardData = useDashboardContext()

  channels = channels ?? dashboardData.guild.channels

  const filteredChannels = channels
    .filter((channel) => channel.type === channelType)
    .sort((a, b) => a.position - b.position)

  const categories = channels
    .filter((channel) => channel.type === ChannelType.GuildCategory)
    .sort((a, b) => a.position - b.position)

  const categoriesWithChannels: [string, typeof filteredChannels][] =
    categories.map((category) => [
      category.name,
      filteredChannels.filter((channel) => channel.parent_id === category.id),
    ])

  const orphanedChannels = categoriesWithChannels
    ? filteredChannels.filter((channel) => !channel.parent_id)
    : undefined

  const selectedChannel = filteredChannels.find(
    (channel) => channel.id === props.value,
  )

  return (
    <Select
      {...props}
      key={key}
      value={selectedChannel && `${props.value}`}
      onValueChange={(value) => {
        if (value === "deselect") {
          props.onChange(null)
          setKey(+new Date())
        } else {
          props.onChange(value)
        }
      }}
    >
      <SelectTrigger>
        {selectedChannel ? (
          <div className="inline-flex items-center gap-1">
            <ChannelIcon type={selectedChannel.type as AllowedChannelType} />
            <span>{selectedChannel.name}</span>
          </div>
        ) : (
          placeholder
        )}
      </SelectTrigger>
      <SelectContent className="max-h-[30vh] overflow-x-hidden overflow-y-scroll">
        {orphanedChannels && (
          <SelectGroup>
            <SelectLabel className="sr-only">Orphaned Channels</SelectLabel>
            {orphanedChannels.map((channel) => (
              <SelectItem
                value={channel.id === props.value ? "deselect" : channel.id}
                key={channel.id}
                className={cn(
                  props.value !== channel.id && "text-muted-foreground",
                  "pr-2 [&>*:nth-child(2)]:w-full",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1">
                    <ChannelIcon type={channel.type as AllowedChannelType} />
                    <span>{channel.name}</span>
                  </div>
                  {props.value === channel.id && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        {categoriesWithChannels.map(([categoryName, channels]) => (
          <SelectGroup key={categoryName}>
            <SelectLabel className="inline-flex items-center gap-1">
              <ChevronDownIcon className="h-4 w-4" />
              <span>{categoryName}</span>
            </SelectLabel>
            {channels.map((channel) => (
              <SelectItem
                value={channel.id === props.value ? "deselect" : channel.id}
                key={channel.id}
                className={cn(
                  props.value !== channel.id && "text-muted-foreground",
                  "pr-2 [&>*:nth-child(2)]:w-full",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1">
                    <ChannelIcon type={channel.type as AllowedChannelType} />
                    <span>{channel.name}</span>
                  </div>
                  {props.value === channel.id && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
