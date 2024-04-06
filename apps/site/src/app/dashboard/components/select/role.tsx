"use client"

import { CheckIcon } from "@radix-ui/react-icons"
import { type APIRole } from "discord-api-types/v10"
import { type ControllerRenderProps } from "react-hook-form"

import { Spinner } from "@/components/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

type SelectRoleType = <TFallback extends boolean>(
  props: TFallback extends true
    ? { fallback: TFallback }
    : ControllerRenderProps & {
        roles: APIRole[]
        fallback?: TFallback
      },
) => JSX.Element

export const SelectRole: SelectRoleType = (props) => {
  if (props.fallback)
    return (
      <Select>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Spinner />
            Loading...
          </div>
        </SelectTrigger>
      </Select>
    )

  const roles = props.roles
    .filter((role) => role.name !== "@everyone")
    .sort((a, b) => b.position - a.position)

  const selectedRole = roles.find((role) => role.id === props.value)

  return (
    <Select
      disabled={props.disabled}
      name={props.name}
      onValueChange={(value) =>
        props.onChange(value !== "deselect" ? value : null)
      }
      value={selectedRole && `${props.value}`}
    >
      <SelectTrigger
        style={{
          color: selectedRole?.color
            ? `#${selectedRole.color.toString(16)}`
            : undefined,
        }}
        className="bg-popover"
      >
        {selectedRole?.name ?? "Select a role"}
      </SelectTrigger>
      <SelectContent className="no-scroll-buttons">
        <div className="max-h-[30vh] overflow-x-hidden overflow-y-scroll p-1">
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
                {role.name}
                {props.value === role.id && (
                  <CheckIcon className="ml-auto h-4 w-4" />
                )}
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  )
}
