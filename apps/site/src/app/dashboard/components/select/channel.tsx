"use client"

import { type ControllerRenderProps } from "react-hook-form"

import { CheckIcon } from "@radix-ui/react-icons"

import * as DiscordAPITypes from "discord-api-types/v10"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Spinner } from "@/components/spinner"

import { cn } from "@/lib/utils"


type SelectChannelType = <TFallback extends boolean, TChannel extends DiscordAPITypes.GuildChannelType> (props: TFallback extends true
  ? { fallback: TFallback }
  : ControllerRenderProps & {
    categories?: true,
    channels: DiscordAPITypes.APIGuildChannel<DiscordAPITypes.GuildChannelType>[],
    channelType: TChannel,
    fallback?: TFallback,
  }
) => JSX.Element


export const SelectChannel: SelectChannelType = (props) => {
  if (props.fallback) return <Select>
    <SelectTrigger>
      <div className="flex items-center gap-2">
        <Spinner />
        Loading...
      </div>
    </SelectTrigger>
  </Select>

  const channels = props.channels
    .filter(channel => channel.type === props.channelType)
    .sort((a, b) => a.position - b.position)

  const categories = props.channels
    .filter(category => category.type === DiscordAPITypes.ChannelType.GuildCategory)
    .sort((a, b) => a.position - b.position)

  const channelsWithCategories = (
    props.categories &&
    new Map(categories.map(category => [category.id, channels.filter(channel => channel.parent_id! === category.id)]))
  )

  const placeholder = `Select a ${props.channelType === DiscordAPITypes.ChannelType.GuildCategory ? "category" : "channel"}`

  return (
    <Select
      disabled={props.disabled}
      name={props.name}
      onValueChange={(value) => { value === "deselect" ? props.onChange(null) : props.onChange(value) }}
      value={props.value}
    >
      <SelectTrigger className="bg-popover">
        {props.value ? channels.find(c=>c.id==props.value)?.name : placeholder}
      </SelectTrigger>
      <SelectContent className="no-scroll-buttons">
        <div className="max-h-[30vh] overflow-y-scroll overflow-x-hidden p-1" children={
          channelsWithCategories ? (
            Array.from(channelsWithCategories.keys())
              .filter((key) => channelsWithCategories.get(key)!.length)
              .map((key) => (
                <SelectGroup key={key}>
                  <SelectLabel>
                    {categories.find(category => category.id == key)!.name}
                  </SelectLabel>
                  {channelsWithCategories.get(key)!.map(channel => (
                    <SelectItem
                      value={channel.id === props.value ? "deselect" : channel.id}
                      key={channel.id} 
                      className={cn(props.value !== channel.id && "text-muted-foreground", "[&>*:nth-child(2)]:w-full pr-2")}
                    >
                      <div className="flex items-center justify-between">
                        {channel.name}
                        {props.value === channel.id && <CheckIcon className="h-4 w-4 ml-auto" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
          ) : (
            channels.map((channel) => (
              <SelectItem
                value={channel.id === props.value ? "deselect" : channel.id}
                key={channel.id} 
                className={cn(props.value !== channel.id && "text-muted-foreground", "[&>*:nth-child(2)]:w-full pr-2")}
              >
                <div className="flex items-center justify-between">
                  {channel.name}
                  {props.value === channel.id && <CheckIcon className="h-4 w-4 ml-auto" />}
                </div>
              </SelectItem>
            ))
          )
        } />
      </SelectContent>
    </Select>
  )
}
