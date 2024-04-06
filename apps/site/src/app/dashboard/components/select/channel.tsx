"use client"

import { CheckIcon } from "@radix-ui/react-icons"
import * as DiscordAPITypes from "discord-api-types/v10"
import { type ControllerRenderProps } from "react-hook-form"

import { Spinner } from "@/components/spinner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

type SelectChannelType = <
  TFallback extends boolean,
  TChannel extends DiscordAPITypes.GuildChannelType,
>(
  props: TFallback extends true
    ? { fallback: TFallback }
    : ControllerRenderProps & {
        categories?: true
        channels: DiscordAPITypes.APIGuildChannel<DiscordAPITypes.GuildChannelType>[]
        channelType: TChannel
        fallback?: TFallback
      },
) => JSX.Element

export const SelectChannel: SelectChannelType = (props) => {
  if (props.fallback)
    return (
      <Select>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Spinner />
            Loading...
          </div>
        </SelectTrigger>
      </Select>
    )

  const channels = props.channels
    .filter((channel) => channel.type === props.channelType)
    .sort((a, b) => a.position - b.position)

  const categories = props.channels
    .filter(
      (category) => category.type === DiscordAPITypes.ChannelType.GuildCategory,
    )
    .sort((a, b) => a.position - b.position)

  const channelsWithCategories =
    props.categories &&
    new Map(
      categories.map((category) => [
        category.id,
        channels.filter((channel) => channel.parent_id === category.id),
      ]),
    )

  const placeholder = `Select a ${props.channelType === DiscordAPITypes.ChannelType.GuildCategory ? "category" : "channel"}`

  const selectedChannel = channels.find((channel) => channel.id === props.value)

  return (
    <Select
      disabled={props.disabled}
      name={props.name}
      onValueChange={(value) => {
        value === "deselect" ? props.onChange(null) : props.onChange(value)
      }}
      value={props.value ? `${props.value}` : undefined}
    >
      <SelectTrigger className="bg-popover">
        {selectedChannel ? selectedChannel.name : placeholder}
      </SelectTrigger>
      <SelectContent className="no-scroll-buttons">
        <div className="max-h-[30vh] overflow-x-hidden overflow-y-scroll p-1">
          {channelsWithCategories
            ? Array.from(channelsWithCategories.keys())
                .filter((key) => channelsWithCategories.get(key)!.length)
                .map((key) => (
                  <SelectGroup key={key}>
                    <SelectLabel>
                      {categories.find((category) => category.id === key)!.name}
                    </SelectLabel>
                    {channelsWithCategories.get(key)!.map((channel) => (
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
                ))
            : channels.map((channel) => (
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
              ))}
        </div>
      </SelectContent>
    </Select>
  )
}
