"use client"

import * as React from "react"
import { useState } from "react"

import { Cross1Icon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"

import { Badge } from "~/components/ui/badge"
import { buttonVariants } from "~/components/ui/button"
import { Command, CommandItem } from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { useDashboardContext } from "~/hooks/use-dashboard-context"
import { useElementSize } from "~/hooks/use-element-size"

import { cn } from "~/lib/utils"

import type { APIRole } from "@discordjs/core/http-only"
import type { RefCallBack } from "react-hook-form"

interface Selectable {
  label: string
  value: string
  colour?: string
}

interface MultiselectRoleProps {
  name: string
  value: string[]
  disabled?: boolean
  placeholder?: string
  roles?: APIRole[]
  ref: RefCallBack
  onChange: (value: string[]) => void
}

export const MultiselectRole = React.forwardRef<
  HTMLInputElement,
  MultiselectRoleProps
>(({ roles, placeholder, value, name, disabled, onChange }, ref) => {
  if (!placeholder) placeholder = "Select some roles..."

  const dashboardData = useDashboardContext()
  const roleData = roles ?? dashboardData.guild.roles

  const roleSelectables: Selectable[] = React.useMemo(() => {
    const availableRoles = roleData.filter((role) => role.name !== "@everyone")

    return availableRoles
      .sort((a, b) => b.position - a.position)
      .map((role) => ({
        label: role.name,
        value: role.id,
        colour: role.color
          ? `#${role.color.toString(16).padStart(6, "0")}`
          : undefined,
      }))
  }, [roleData])

  const [key, setKey] = useState(+new Date())

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")

  React.useImperativeHandle(ref, () => inputRef.current!)

  const triggerRef = React.useRef<HTMLDivElement>(null)
  const [triggerWidth] = useElementSize(triggerRef)

  const [selectedValues, setSelectedValues] = React.useState<Selectable[]>(
    roleSelectables.filter((role) => value.includes(role.value)),
  )

  const handleSelect = React.useCallback(
    (selectable: Selectable) => {
      setInputValue("")
      setSelectedValues((prev) => [...prev, selectable])
      onChange(selectedValues.map((s) => s.value))
      setKey(+new Date())
    },
    [onChange, selectedValues],
  )

  const handleUnselect = React.useCallback((selectable: Selectable) => {
    setSelectedValues((prev) =>
      prev.filter((s) => s.value !== selectable.value),
    )
    setKey(+new Date())
  }, [])

  const handleKeyDown = React.useCallback(
    ({ key }: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current!
      if (key === "Escape") return input.blur()
      if ((key === "Delete" || key === "Backspace") && input.value === "") {
        return setSelectedValues((prev) => prev.slice(0, -1))
      }
    },
    [],
  )

  const selectables = roleSelectables
    .filter((selectable) => !selectedValues.includes(selectable))
    .slice(0, 5)

  return (
    <Command onKeyDown={handleKeyDown}>
      <Popover>
        <PopoverTrigger asChild>
          <div
            ref={triggerRef}
            onFocus={() => inputRef.current!.focus()}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hover:bg-background h-auto min-h-9 w-full cursor-text justify-start px-3 font-normal",
            )}
          >
            <div className="flex flex-wrap gap-1">
              {selectedValues.map((selectedValue) => {
                return (
                  <Badge
                    key={selectedValue.value}
                    variant="secondary"
                    className="gap-1.5"
                  >
                    <button
                      className="ring-offset-background focus:ring-ring rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={({ key }) =>
                        key === "Enter" && handleUnselect(selectedValue)
                      }
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleUnselect(selectedValue)
                      }}
                      disabled={disabled}
                    >
                      <Cross1Icon className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </button>
                    {selectedValue.label}
                  </Badge>
                )
              })}
              <CommandPrimitive.Input
                name={name}
                disabled={disabled}
                placeholder={placeholder}
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                className={cn(
                  "placeholder:text-muted-foreground inline-block w-min whitespace-nowrap bg-transparent outline-none",
                  selectedValues.length && "ml-1",
                )}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          key={key}
          style={{ width: triggerWidth + "px" }}
          className="p-1"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onFocus={(e) => {
            e.preventDefault()
            inputRef.current!.focus()
          }}
        >
          {selectables.map((selectable) => {
            return (
              <CommandItem
                key={selectable.value}
                disabled={disabled}
                onSelect={() => handleSelect(selectable)}
              >
                {selectable.label}
              </CommandItem>
            )
          })}
        </PopoverContent>
      </Popover>
    </Command>
  )
})
