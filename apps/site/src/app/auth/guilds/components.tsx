"use client"

import Link from "next/link"
import * as React from "react"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
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

import { cn, getInitials } from "~/lib/utils"

import { selectGuild } from "~/app/auth/actions"

export interface Guild {
  id: string
  name: string
  icon_url: string | null
}

interface SelectGuildProps {
  guilds: Guild[]
  defaultValue?: Guild
}

export function SelectGuild({ guilds, defaultValue }: SelectGuildProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [value, setValue] = React.useState<Guild | undefined>(defaultValue)
  const [isLoading, setIsLoading] = React.useState(false)

  const onValueChange = async (value: Guild | undefined) => {
    setValue(value)

    if (value) {
      setIsLoading(true)

      try {
        await selectGuild(value.id)
      } catch (error) {
        console.error(error)
        setValue(undefined)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="w-72 space-y-4 md:w-[336px]">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger disabled={isLoading} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            {value ? (
              <div className="flex items-center">
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage src={value.icon_url ?? "/discord.png"} />
                  <AvatarFallback>{getInitials(value.name)}</AvatarFallback>
                </Avatar>
                {value.name}
              </div>
            ) : (
              "Select a server..."
            )}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 md:w-[336px]">
          <Command>
            <CommandInput placeholder="Search servers..." />
            <CommandList>
              <CommandEmpty>No server found.</CommandEmpty>
              <CommandGroup>
                {guilds.map((guild) => (
                  <CommandItem
                    key={guild.id}
                    value={guild.name}
                    onSelect={(currentValue) => {
                      const guild = guilds.find(
                        (guild) => guild.name.toLowerCase() === currentValue,
                      )

                      const newValue =
                        guild?.id === value?.id ? undefined : guild

                      setValue(newValue)
                      setIsOpen(false)

                      void onValueChange(newValue)
                    }}
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage src={guild.icon_url ?? "/discord.png"} />
                      <AvatarFallback>{getInitials(guild.name)}</AvatarFallback>
                    </Avatar>
                    {guild.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value?.id === guild.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        size={"lg"}
        className="w-full"
        disabled={!value || isLoading}
        asChild
      >
        <Link href={"/dashboard/modules"}>Enter the dashboard</Link>
      </Button>
    </div>
  )
}
