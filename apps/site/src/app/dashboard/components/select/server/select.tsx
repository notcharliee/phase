"use client"

import { useState } from "react"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { setGuildCookie } from "@/lib/actions"
import { cn, getInitials } from "@/lib/utils"

type Guilds = {
  id: string
  name: string
  icon: string
  disabled: boolean
}[]

type SelectServerProps<T extends boolean> = T extends true
  ? { guilds?: Guilds; defaultValue?: string; fallback: T }
  : { guilds: Guilds; defaultValue: string; fallback?: T }

export const SelectServer = <T extends boolean>(
  props: SelectServerProps<T>,
) => {
  if (props.fallback)
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className="w-full justify-between sm:w-[200px]"
      >
        Loading...
      </Button>
    )

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(props.defaultValue)

  const guild = props.guilds.find((guild) => guild.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between sm:w-[200px]"
        >
          {guild ? (
            <div className="line-clamp-1 flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={guild.icon} />
                <AvatarFallback className="text-xs">
                  {getInitials(guild.name)}
                </AvatarFallback>
              </Avatar>
              {guild.name}
            </div>
          ) : (
            "Select server..."
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 sm:w-[200px]">
        <Command>
          <CommandInput placeholder="Search servers..." className="h-9" />
          <CommandEmpty>No server found.</CommandEmpty>
          <CommandList className="max-h-64">
            <CommandGroup heading="Your Servers">
              {props.guilds
                .filter((g) => !g.disabled)
                .map((guild) => (
                  <CommandItem
                    key={guild.id}
                    value={guild.name}
                    disabled={guild.disabled}
                    onSelect={async (currentValue) => {
                      currentValue = props.guilds.find(
                        (g) =>
                          g.name.toLowerCase() === currentValue ||
                          g.id === currentValue,
                      )!.id

                      setValue(currentValue === value ? "" : currentValue)
                      setGuildCookie(currentValue === value ? "" : currentValue).then(() => console.log("e"))
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={guild.icon} />
                        <AvatarFallback className="text-xs">
                          {getInitials(guild.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="line-clamp-1">{guild.name}</span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === guild.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading="No Access">
              {props.guilds
                .filter((g) => g.disabled)
                .map((guild) => (
                  <CommandItem
                    key={guild.id}
                    value={guild.name}
                    disabled={guild.disabled}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={guild.icon} />
                        <AvatarFallback className="text-xs">
                          {getInitials(guild.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="line-clamp-1">{guild.name}</span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === guild.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
