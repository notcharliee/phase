"use client"

import * as React from "react"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { MentionBadge } from "~/components/dashboard/badges/mention"
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

import type { APIRole } from "@discordjs/core/http-only"
import type { Optional } from "~/types/utils"

interface Selectable {
  name: string
  value: string
  hexColour?: string
}

interface SelectMentionProps<TMultiselect extends boolean = boolean> {
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

export const SelectMention = React.forwardRef<
  HTMLInputElement,
  SelectMentionProps
>(
  (
    {
      placeholder = "Select a mention",
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

    const sortedSelectables: Selectable[] = React.useMemo(() => {
      const roles = dashboard.guild.roles.reduce<APIRole[]>((acc, role) => {
        if (role.name !== "@everyone") {
          acc.push(role)
        }

        return acc
      }, [])

      const sortedRoles = roles.sort((a, b) => a.position + b.position)

      return [
        {
          name: "@everyone",
          value: "@everyone",
        },
        {
          name: "@here",
          value: "@here",
        },
        ...sortedRoles.map((role) => ({
          name: `@${role.name}`,
          value: `<@&${role.id}>`,
          hexColour:
            role.color !== 0
              ? "#" + role.color.toString(16).padStart(6, "0")
              : undefined,
        })),
      ]
    }, [dashboard.guild.roles])

    const selectedValues = React.useMemo(() => {
      return sortedSelectables.filter((selectable) =>
        value?.includes(selectable.value),
      )
    }, [sortedSelectables, value])

    const handleSelect = (selectable: Selectable) => {
      setInputValue("")
      setOpen(false)
      onChange(
        multiselect ? [...(value ?? []), selectable.value] : selectable.value,
      )
    }

    const handleDeselect = (selectable: Selectable) => {
      onChange(
        multiselect
          ? (value as string[]).filter((id) => id !== selectable.value)
          : "",
      )
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Backspace" && inputValue === "") {
        const selectableToRemove = multiselect
          ? selectedValues[selectedValues.length - 1]
          : selectedValues[0]
        handleDeselect(selectableToRemove!)
      }
    }

    const renderSelectedMentions = () =>
      multiselect ? (
        selectedValues.length ? (
          selectedValues.map((selectable) => (
            <MentionBadge
              key={selectable.value}
              mention={selectable}
              onButtonClick={() => handleDeselect(selectable)}
            />
          ))
        ) : (
          <span>{placeholder}</span>
        )
      ) : selectedValues[0] ? (
        <span style={{ color: selectedValues[0].hexColour }}>
          {selectedValues[0].name}
        </span>
      ) : (
        <span>{placeholder}</span>
      )

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            role="combobox"
            variant="outline"
            className="hover:bg-background h-auto min-h-9 w-full justify-between px-3 py-1.5 font-normal transition-colors"
          >
            <div className="flex flex-wrap gap-1">
              {renderSelectedMentions()}
            </div>
            <CaretSortIcon className="text-muted-foreground ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" style={{ width: triggerWidth + "px" }}>
          <Command onKeyDown={onKeyDown} loop>
            <CommandInput
              ref={ref as React.Ref<never>}
              name={name}
              disabled={disabled}
              placeholder={"Search mentions..."}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>No results found :(</CommandEmpty>
              <CommandGroup>
                {sortedSelectables.map((selectable) => (
                  <CommandItem
                    key={selectable.value}
                    value={selectable.name}
                    onSelect={() =>
                      value?.includes(selectable.value)
                        ? handleDeselect(selectable)
                        : handleSelect(selectable)
                    }
                  >
                    <span style={{ color: selectable.hexColour }}>
                      {selectable.name}
                    </span>
                    <span className="absolute right-2">
                      {value?.includes(selectable.value) && (
                        <CheckIcon className="h-4 w-4" />
                      )}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)
SelectMention.displayName = "SelectMention"
