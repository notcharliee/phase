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

interface SelectRoleProps extends ControllerRenderProps {
  roles?: APIRole[]
  placeholder?: string
}

export function SelectRole(props: SelectRoleProps) {
  const [key, setKey] = useState(+new Date())

  const dashboardData = useDashboardContext()

  const roles = (
    props.roles ??
    dashboardData.guild.roles.filter((role) => role.name !== "@everyone")
  ).sort((a, b) => b.position - a.position)

  const selectedRole = roles.find((role) => role.id === props.value)

  const placeholder = props.placeholder ?? "Select a role"

  return (
    <Select
      key={key}
      disabled={props.disabled}
      name={props.name}
      value={selectedRole && `${props.value}`}
      onValueChange={(value) => {
        if (value !== "deselect") {
          props.onChange(value)
          setKey(+new Date())
        } else {
          props.onChange(null)
        }
      }}
    >
      <SelectTrigger>
        <span
          style={{
            color: selectedRole?.color
              ? `#${selectedRole.color.toString(16)}`
              : undefined,
          }}
        >
          {selectedRole?.name ? `@${selectedRole.name}` : placeholder}
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-[30vh] overflow-x-hidden overflow-y-scroll">
        {roles.map((role) => (
          <SelectItem
            value={role.id === props.value ? "deselect" : role.id}
            key={role.id}
            style={{
              color: role.color ? `#${role.color.toString(16)}` : undefined,
            }}
            className={cn(
              props.value !== role.id && "text-muted-foreground",
              "pr-2 [&>*:nth-child(2)]:w-full",
            )}
          >
            <div className="flex items-center justify-between">
              {`@${role.name}`}
              {props.value === role.id && (
                <CheckIcon className="ml-auto h-4 w-4" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
