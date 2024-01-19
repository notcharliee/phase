"use client"

import { useRouter } from "next/navigation"

import { z } from "zod"

import { updateAuditLogsModule } from "@/lib/actions"

import {
  type APIGuildCategoryChannel,
  type APITextChannel,
} from "discord-api-types/v10"

import { Button } from "@/components/ui/button"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  formBuilder,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"


const formSchema = z.object({
  enabled: z.boolean(),
  channels: z.object({
    server: z.string().nullable(),
    messages: z.string().nullable(),
    voice: z.string().nullable(),
    invites: z.string().nullable(),
    members: z.string().nullable(),
    punishments: z.string().nullable(),
  })
})


export const AuditLogsForm = (props: {
  defaultValues: z.TypeOf<typeof formSchema>,
  data: {
    textChannels: APITextChannel[],
    categoryChannels: APIGuildCategoryChannel[],
    orderedChannels: Map<string, APITextChannel[]>,
  },
}) => {
  const { textChannels, categoryChannels, orderedChannels } = props.data
  
  const router = useRouter()

  const ChannelSelect = (props: { field: any }) => (
    <Select defaultValue={props.field.value ?? undefined} onValueChange={props.field.onChange} name={props.field.name} disabled={props.field.disabled}>
      <SelectTrigger className="w-full bg-popover">
        {textChannels.find(channel => channel.id == props.field.value)?.name ?? "Select a channel"}
      </SelectTrigger>
      <SelectContent>
        {
          Array.from(orderedChannels.keys())
            .filter(key => orderedChannels.get(key)!.length)
            .map(key => (
              <SelectGroup key={key}>
                <SelectLabel>{categoryChannels.find(category => category.id == key)!.name}</SelectLabel>
                {orderedChannels.get(key)!.map(channel => (
                  <SelectItem value={channel.id} key={channel.id} className="text-muted-foreground">{channel.name}</SelectItem>
                ))}
              </SelectGroup>
            ))
        }
      </SelectContent>
    </Select>
  )

  return formBuilder({
    defaultValues: props.defaultValues,
    onSubmit: updateAuditLogsModule,
    schema: formSchema,
  },
  ({ form }) => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="channels.server"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Logs</FormLabel>
              <FormControl>
                <ChannelSelect field={field} />
              </FormControl>
              <FormDescription>Logs for channels, roles, boosts, and emojis</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channels.messages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Logs</FormLabel>
              <FormControl>
                <ChannelSelect field={field} />
              </FormControl>
              <FormDescription>Logs message deletes and edits {"[No Message Content]"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channels.voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice Logs</FormLabel>
              <FormControl>
                <ChannelSelect field={field} />
              </FormControl>
              <FormDescription>Logs voice channel joins, leaves, mutes, and deafens</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channels.invites"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invite Logs</FormLabel>
              <FormControl>
                <ChannelSelect field={field} />
              </FormControl>
              <FormDescription>Logs invite creates and usage</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channels.punishments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Punishment Logs</FormLabel>
              <FormControl>
                <ChannelSelect field={field} />
              </FormControl>
              <FormDescription>Logs bans, timeouts, and warns</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="submit" className="mr-3">Save Changes</Button>
      <Button type="reset" variant={"destructive"} onClick={() => router.back()}>Discard Changes</Button>
    </>
  ))
}
