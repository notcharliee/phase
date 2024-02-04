"use client"

import { type ControllerRenderProps } from "react-hook-form"

import { CheckIcon } from "@radix-ui/react-icons"

import * as DiscordAPITypes from "discord-api-types/v10"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Spinner } from "@/components/spinner"

import { cn } from "@/lib/utils"


type SelectRoleType = <TFallback extends boolean> (props: TFallback extends true
  ? { fallback: TFallback }
  : ControllerRenderProps & {
    roles: DiscordAPITypes.APIRole[],
    fallback?: TFallback,
  }
) => JSX.Element


export const SelectRole: SelectRoleType = (props) => {
  if (props.fallback) return <Select>
    <SelectTrigger>
      <div className="flex items-center gap-2">
        <Spinner />
        Loading...
      </div>
    </SelectTrigger>
  </Select>

  const roles = props.roles
    .filter(role => role.name !== "@everyone")
    .sort((a, b) => b.position - a.position)

  return (
    <Select
      disabled={props.disabled}
      name={props.name}
      onValueChange={(value) => { value === "deselect" ? props.onChange(null) : props.onChange(value) }}
      value={props.value}
    >
      <SelectTrigger
        style={{ color: roles.find(r=>r.id==props.value)?.color ? `#${roles.find(r=>r.id==props.value)!.color.toString(16)}` : undefined }}
        className="bg-popover"
      >
        {props.value ? roles.find(r=>r.id==props.value)?.name : "Select a role"}
      </SelectTrigger>
      <SelectContent className="no-scroll-buttons">
        <div className="max-h-[30vh] overflow-y-scroll overflow-x-hidden p-1" children={
          roles.map((role) => (
            <SelectItem
              value={role.id === props.value ? "deselect" : role.id}
              key={role.id}
              style={{ color: role.color ? `#${role.color.toString(16)}` : undefined }}
              className={cn(
                props.value !== role.id && "text-muted-foreground",
                "[&>*:nth-child(2)]:w-full pr-2"
              )}
            >
              <div className="flex items-center justify-between">
                {role.name}
                {props.value === role.id && <CheckIcon className="h-4 w-4 ml-auto" />}
              </div>
            </SelectItem>
          ))
        } />
      </SelectContent>
    </Select>
  )
}
