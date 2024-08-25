"use client"

import { useState } from "react"

import { CheckIcon } from "@radix-ui/react-icons"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { cn } from "~/lib/utils"

import type { APIRole } from "discord-api-types/v10"
import type { ControllerRenderProps } from "react-hook-form"

interface SelectMentionProps extends ControllerRenderProps {
  roles?: APIRole[]
  placeholder?: string
}

export function SelectMention(props: SelectMentionProps) {
  const [key, setKey] = useState(+new Date())

  const dashboardData = useDashboardContext()

  const roles =
    props.roles ??
    dashboardData.guild.roles.filter((role) => role.name !== "@everyone")

  interface Mention {
    label: string
    value: string
    colour?: string
  }

  const mentions: Mention[] = [
    {
      label: "@everyone",
      value: "@everyone",
    },
    {
      label: "@here",
      value: "@here",
    },
    ...roles.map((role) => ({
      label: `@${role.name}`,
      value: `<@&${role.id}>`,
      colour: `#${role.color.toString(16)}`,
    })),
  ]

  const selectedMention = mentions.find(
    (mention) => mention.value === props.value,
  )

  return (
    <Select
      key={key}
      disabled={props.disabled}
      name={props.name}
      value={selectedMention ? `${props.value}` : undefined}
      onValueChange={(value) => {
        if (value === "deselect") {
          props.onChange(undefined)
          setKey(+new Date())
        } else {
          props.onChange(value)
        }
      }}
    >
      <SelectTrigger>
        <span style={{ color: selectedMention?.colour }}>
          {selectedMention?.label ?? props.placeholder ?? "Select a mention"}
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-[30vh] overflow-x-hidden overflow-y-scroll">
        {mentions.map((mention) => (
          <SelectItem
            key={mention.value}
            value={mention.value === props.value ? "deselect" : mention.value}
            style={{ color: mention.colour }}
            className={cn(
              mention.value !== props.value && "text-muted-foreground",
              "pr-2 [&>*:nth-child(2)]:w-full",
            )}
          >
            <div className="flex items-center justify-between">
              {mention.label}
              {mention.value === props.value && (
                <CheckIcon className="ml-auto h-4 w-4" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
