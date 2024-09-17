"use client"

import * as React from "react"

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

  const selectableRoles: Selectable[] = React.useMemo(() => {
    return (roles ?? dashboardData.guild.roles)
      .filter((role) => role.name !== "@everyone" && !role.managed)
      .sort((a, b) => b.position - a.position)
      .map((role) => ({
        label: role.name,
        value: role.id,
        colour:
          role.color !== 0
            ? `#${role.color.toString(16).padStart(6, "0")}`
            : undefined,
      }))
  }, [dashboardData.guild.roles])

  const selectedRoles = React.useMemo(() => {
    return selectableRoles.filter((role) => value.includes(role.value))
  }, [selectableRoles, value])

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")

  React.useImperativeHandle(ref, () => inputRef.current!)

  const triggerRef = React.useRef<HTMLDivElement>(null)
  const [triggerWidth] = useElementSize(triggerRef)

  const handleSelect = (selectable: Selectable) => {
    setInputValue("")
    onChange([...value, selectable.value])
  }

  const handleDeselect = (selectable: Selectable) => {
    onChange(value.filter((value) => value !== selectable.value))
  }

  const handleKeyDown = ({ key }: React.KeyboardEvent<HTMLDivElement>) => {
    if (key === "Escape") return inputRef.current?.blur()
    if ((key === "Delete" || key === "Backspace") && inputValue === "") {
      return onChange(value.slice(0, -1))
    }
  }

  const selectables = selectableRoles
    .filter((role) => !selectedRoles.includes(role))
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
              {selectedRoles.map((role) => {
                return (
                  <Badge
                    key={role.value}
                    variant="secondary"
                    className="gap-1.5"
                  >
                    <button
                      disabled={disabled}
                      className="ring-offset-background focus:ring-ring rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={({ key }) =>
                        key === "Enter" && handleDeselect(role)
                      }
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleDeselect(role)
                      }}
                    >
                      <Cross1Icon className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </button>
                    {role.label}
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
                  selectedRoles.length && "ml-1",
                )}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-1"
          style={{ width: triggerWidth + "px" }}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {selectables.map((selectable, index) => {
            return (
              <CommandItem
                key={index + selectable.value}
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
