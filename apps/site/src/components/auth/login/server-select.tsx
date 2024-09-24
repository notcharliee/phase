"use client"

import { useState } from "react"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { cn, getInitials } from "~/lib/utils"

interface Guild {
  id: string
  name: string
  icon_url: string | null
}

interface ServerComboboxProps {
  onChange?: (value?: Guild) => void
  disabled?: boolean
  value?: Guild
  guilds: Guild[]
}

function ServerCombobox(props: ServerComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(props.value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
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
          <CommandEmpty>No server found.</CommandEmpty>
          <CommandGroup>
            {props.guilds.map((guild) => (
              <CommandItem
                key={guild.id}
                value={guild.name}
                disabled={props.disabled}
                onSelect={(currentValue) => {
                  const guild = props.guilds.find(
                    (guild) => guild.name.toLowerCase() === currentValue,
                  )

                  const newValue = guild?.id === value?.id ? undefined : guild

                  setValue(newValue)
                  setOpen(false)

                  if (props.onChange) props.onChange(newValue)
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
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface ServerSelectProps extends Pick<ServerComboboxProps, "guilds"> {
  accessToken: string
  onLoginCallbackSubmit: (accessToken: string, guildId: string) => Promise<void>
}

export function ServerSelect(props: ServerSelectProps) {
  const [value, setValue] = useState<ServerComboboxProps["value"]>(undefined)
  const [state, setState] = useState<"loading" | "error">()

  const onClick = () => {
    if (!value) return

    setState("loading")

    props
      .onLoginCallbackSubmit(props.accessToken, value.id)
      .catch(() => setState("error"))
  }

  const disabled = value ? state === "loading" : false

  return (
    <div className="w-72 space-y-4 md:w-[336px]">
      <ServerCombobox
        guilds={props.guilds}
        value={value}
        disabled={disabled}
        onChange={setValue}
      />
      <Button
        size={"lg"}
        className="w-full gap-2"
        disabled={disabled}
        onClick={onClick}
      >
        {state === "loading"
          ? "One moment..."
          : state === "error"
            ? "An error occurred"
            : "Enter the dashboard"}
      </Button>
    </div>
  )
}
