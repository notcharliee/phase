import { type ControllerRenderProps } from "react-hook-form"

import type {
  GuildChannelType,
  APIGuildChannel,
  APIRole,
} from "discord-api-types/v10"

import { ChannelType } from "discord-api-types/v10"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"


export const ChannelSelect = <T extends GuildChannelType> (props: {
  channels: APIGuildChannel<GuildChannelType>[],
  field: ControllerRenderProps<any, any>,
  showCategories?: boolean,
  type: T,
}) => {
  const channels = props.channels.filter(channel => channel.type == props.type).sort((a, b) => a.position - b.position)
  const categories = props.channels.filter(category => category.type == ChannelType.GuildCategory).sort((a, b) => a.position - b.position)

  const channelsWithCategories = props.showCategories
    ? new Map(categories.map(category => [category.id, channels.filter(channel => channel.parent_id! == category.id)]))
    : null

  return (
    <Select defaultValue={props.field.value ?? undefined} onValueChange={props.field.onChange} name={props.field.name} disabled={props.field.disabled}>
      <SelectTrigger className="bg-popover">
        {props.channels.find(channel => channel.id == props.field.value)?.name ?? `Select a ${props.type == ChannelType.GuildCategory ? "category" : "channel"}`}
      </SelectTrigger>
      <SelectContent>
        {
          channelsWithCategories ? (
            Array.from(channelsWithCategories.keys())
            .filter(key => channelsWithCategories.get(key)!.length)
            .map(key => (
              <SelectGroup key={key}>
                <SelectLabel>{categories.find(category => category.id == key)!.name}</SelectLabel>
                {channelsWithCategories.get(key)!.map(channel => (
                  <SelectItem value={channel.id} key={channel.id} className="text-muted-foreground">{channel.name}</SelectItem>
                ))}
              </SelectGroup>
            ))
          ) : (
            channels.map(channel => (
              <SelectItem value={channel.id} key={channel.id} className="text-muted-foreground">{channel.name}</SelectItem>
            ))
          )
        }
      </SelectContent>
    </Select>
  )
}


export const RoleSelect = (props: {
  roles: APIRole[],
  field: ControllerRenderProps<any, any>,
}) => {
  const roles = props.roles.filter(role => role.name !== "@everyone").sort((a, b) => b.position - a.position)
  const selectedRole = roles.find(role => role.id == props.field.value)

  return (
    <Select defaultValue={props.field.value ?? undefined} onValueChange={props.field.onChange} name={props.field.name} disabled={props.field.disabled}>
      <SelectTrigger className="bg-popover">
        <span style={{ color: selectedRole?.color ? "#" + selectedRole.color.toString(16) : undefined }}>{selectedRole?.name ?? "Select a role"}</span>
      </SelectTrigger>
      <SelectContent>
        {roles.map(role => (
          <SelectItem value={role.id} key={role.id} className="text-muted-foreground" style={{ color: role?.color ? "#" + role.color.toString(16) : undefined }}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


export const SelectFallback = () => (
  <Select>
    <SelectTrigger className="bg-popover">
      Loading...
    </SelectTrigger>
  </Select>
)