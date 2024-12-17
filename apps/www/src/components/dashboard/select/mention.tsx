"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/combobox"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { ComboboxItem } from "@repo/ui/combobox"
import type { Arrayable, Optional } from "~/types/utils"

interface SelectMentionProps<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
> {
  placeholder?: string
  multiselect?: TMultiselect
  disabled?: boolean
  name: string
  value: TValue
  onValueChange: (value: TValue) => void
}

export function SelectMention<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
>({
  disabled,
  placeholder = "Select a mention",
  ...props
}: SelectMentionProps<TMultiselect, TValue>) {
  const dashboard = useDashboardContext()

  const items = React.useMemo(() => {
    const items: ComboboxItem[] = [
      {
        group: "Server",
        label: "everyone",
        value: "@everyone",
        iconName: "at-sign",
      },
      {
        group: "Server",
        label: "here",
        value: "@here",
        iconName: "at-sign",
      },
    ]

    const roles = dashboard.guild.roles
    const sortedRoles = roles.sort((a, b) => b.position - a.position)

    for (const role of sortedRoles) {
      const isDisabled = false

      const hexColour = role.color
        ? (`#${role.color.toString(16).padStart(6, "0")}` as const)
        : undefined

      items.push({
        group: "Roles",
        label: role.name,
        value: `<@&${role.id}>`,
        disabled: isDisabled,
        colour: hexColour,
        iconName: isDisabled ? "lock" : "at-sign",
      })
    }

    return items
  }, [dashboard.guild.roles])

  return (
    <Combobox>
      <ComboboxTrigger disabled={disabled}>
        <ComboboxValue placeholder={placeholder} />
      </ComboboxTrigger>
      <ComboboxContent items={items} {...props} />
    </Combobox>
  )
}
