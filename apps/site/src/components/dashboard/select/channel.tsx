"use client"

import * as React from "react"

import { ChannelType } from "@discordjs/core/http-only"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { ChannelIcon } from "~/components/channel-icons"
import { ChannelBadge } from "~/components/dashboard/badges/channel"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { useDashboardContext } from "~/hooks/use-dashboard-context"
import { useElementSize } from "~/hooks/use-element-size"

import type {
  APIGuildChannel,
  GuildChannelType,
} from "@discordjs/core/http-only"
import type { Optional } from "~/types/utils"

type GuildChannel = APIGuildChannel<GuildChannelType>
type GuildCategory = APIGuildChannel<ChannelType.GuildCategory> & {
  channels: GuildChannel[]
}

interface SelectChannelProps<TMultiselect extends boolean = boolean> {
  channelType?: keyof typeof ChannelType
  placeholder?: string
  multiselect?: TMultiselect
  name: string
  value: Optional<TMultiselect extends true ? string[] : string>
  disabled?: boolean
  ref: (instance: unknown) => void
  onChange: (
    value: Optional<TMultiselect extends true ? string[] : string>,
  ) => void
}

export const SelectChannel = React.forwardRef<
  HTMLInputElement,
  SelectChannelProps
>(
  (
    {
      channelType = "GuildText",
      placeholder = "Select a channel",
      multiselect = false,
      name,
      value,
      disabled,
      onChange,
    },
    ref,
  ) => {
    const dashboard = useDashboardContext()

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [triggerWidth] = useElementSize(triggerRef)

    const sortedCategories = React.useMemo(() => {
      const categoryMap = dashboard.guild.channels.reduce<
        Record<string, GuildChannel[]>
      >((acc, channel) => {
        if (channel.type === ChannelType[channelType]) {
          const parentId = channel.parent_id ?? "orphaned"
          acc[parentId] = [...(acc[parentId] ?? []), channel]
        }
        return acc
      }, {})

      return Object.entries(categoryMap)
        .map(([categoryId, channels]) => {
          const category = dashboard.guild.channels.find(
            (c) => c.id === categoryId,
          )
          const sortedChannels = channels.sort(
            (a, b) => a.position - b.position,
          )

          return category
            ? { ...(category as GuildCategory), channels: sortedChannels }
            : {
                id: Date.now().toString(),
                name: "",
                type: ChannelType.GuildCategory,
                channels: sortedChannels,
                position: 0,
              }
        })
        .sort((a, b) => a.position - b.position)
    }, [dashboard.guild.channels, channelType])

    const selectedChannels = React.useMemo(() => {
      const allChannels = sortedCategories.flatMap(({ channels }) => channels)
      return allChannels.filter((channel) => value?.includes(channel.id))
    }, [sortedCategories, value])

    const handleSelect = (channel: GuildChannel) => {
      setInputValue("")
      setOpen(false)
      onChange(multiselect ? [...(value ?? []), channel.id] : channel.id)
    }

    const handleDeselect = (channel: GuildChannel) => {
      onChange(
        multiselect
          ? (value as string[]).filter((id) => id !== channel.id)
          : "",
      )
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Backspace" && inputValue === "") {
        const channelToRemove = multiselect
          ? selectedChannels[selectedChannels.length - 1]
          : selectedChannels[0]
        handleDeselect(channelToRemove!)
      }
    }

    const renderSelectedChannels = () =>
      multiselect ? (
        selectedChannels.length ? (
          selectedChannels.map((channel) => (
            <ChannelBadge
              key={channel.id}
              channel={channel}
              onButtonClick={() => handleDeselect(channel)}
            />
          ))
        ) : (
          <span>{placeholder}</span>
        )
      ) : selectedChannels[0] ? (
        <div className="inline-flex items-center gap-1">
          <ChannelIcon type={selectedChannels[0].type} />
          <span>{selectedChannels[0].name}</span>
        </div>
      ) : (
        <span>{placeholder}</span>
      )

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            disabled={disabled}
            role="combobox"
            variant="outline"
            className="hover:bg-background h-auto min-h-9 w-full justify-between px-3 py-1.5 font-normal transition-colors"
          >
            <div className="flex flex-wrap gap-1">
              {renderSelectedChannels()}
            </div>
            <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" style={{ width: triggerWidth + "px" }}>
          <Command onKeyDown={onKeyDown} loop>
            <CommandInput
              ref={ref as React.Ref<never>}
              name={name}
              disabled={disabled}
              placeholder={"Search channels..."}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>No results found :(</CommandEmpty>
              {sortedCategories.map((category) => (
                <CommandGroup
                  key={category.name}
                  heading={category.name.length ? category.name : undefined}
                >
                  {category.channels.map((channel) => (
                    <CommandItem
                      key={channel.id}
                      value={channel.id}
                      keywords={[channel.name]}
                      className="gap-1"
                      onSelect={() =>
                        value?.includes(channel.id)
                          ? handleDeselect(channel)
                          : handleSelect(channel)
                      }
                    >
                      <ChannelIcon type={channel.type} />
                      <span>{channel.name}</span>
                      <span className="absolute right-2">
                        {value?.includes(channel.id) && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)
SelectChannel.displayName = "SelectChannel"
