"use client"

import { CheckIcon } from "@radix-ui/react-icons"
import * as DiscordAPITypes from "discord-api-types/v10"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select"

import { cn } from "~/lib/utils"

import type { ControllerRenderProps } from "react-hook-form"

interface SelectChannelProps extends ControllerRenderProps {
  channels: DiscordAPITypes.APIGuildChannel<DiscordAPITypes.GuildChannelType>[]
  channelType: DiscordAPITypes.GuildChannelType
  categories?: boolean
  placeholder?: string
}

export function SelectChannel(props: SelectChannelProps) {
  const channels = props.channels
    .filter((channel) => channel.type === props.channelType)
    .sort((a, b) => a.position - b.position)

  const categories = props.channels
    .filter(
      (category) => category.type === DiscordAPITypes.ChannelType.GuildCategory,
    )
    .sort((a, b) => a.position - b.position)

  const categoriesWithChannels: [string, typeof channels][] | undefined =
    props.categories
      ? categories.map((category) => [
          category.name,
          channels.filter((channel) => channel.parent_id === category.id),
        ])
      : undefined

  const orphanedChannels = categoriesWithChannels
    ? channels.filter((channel) => !channel.parent_id)
    : undefined

  const placeholder =
    props.placeholder ??
    `Select a ${props.channelType === DiscordAPITypes.ChannelType.GuildCategory ? "category" : "channel"}`

  const selectedChannel = channels.find((channel) => channel.id === props.value)

  return (
    <Select
      disabled={props.disabled}
      name={props.name}
      value={selectedChannel && `${props.value}`}
      onValueChange={(v) => {
        if (v === "deselect") {
          props.onChange(null)
        } else {
          props.onChange(v)
        }
      }}
    >
      <SelectTrigger>{selectedChannel?.name ?? placeholder}</SelectTrigger>
      <SelectContent>
        <div className="max-h-[30vh] overflow-x-hidden overflow-y-scroll p-1">
          {categoriesWithChannels ? (
            <>
              {orphanedChannels && (
                <SelectGroup>
                  <SelectLabel className="sr-only">
                    Orphaned Channels
                  </SelectLabel>
                  {orphanedChannels.map((channel) => (
                    <SelectItem
                      value={
                        channel.id === props.value ? "deselect" : channel.id
                      }
                      key={channel.id}
                      className={cn(
                        props.value !== channel.id && "text-muted-foreground",
                        "pr-2 [&>*:nth-child(2)]:w-full",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        {channel.name}
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
                  <SelectLabel>{categoryName}</SelectLabel>
                  {channels.map((channel) => (
                    <SelectItem
                      value={
                        channel.id === props.value ? "deselect" : channel.id
                      }
                      key={channel.id}
                      className={cn(
                        props.value !== channel.id && "text-muted-foreground",
                        "pr-2 [&>*:nth-child(2)]:w-full",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        {channel.name}
                        {props.value === channel.id && (
                          <CheckIcon className="ml-auto h-4 w-4" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </>
          ) : (
            channels.map((channel) => (
              <SelectItem
                value={channel.id === props.value ? "deselect" : channel.id}
                key={channel.id}
                className={cn(
                  props.value !== channel.id && "text-muted-foreground",
                  "pr-2 [&>*:nth-child(2)]:w-full",
                )}
              >
                <div className="flex items-center justify-between">
                  {channel.name}
                  {props.value === channel.id && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  )
}
