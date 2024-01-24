"use client"

import { useRouter } from "next/navigation"

import { z } from "zod"

import { ChannelType } from "discord-api-types/v10"

import type {
  GuildChannelType,
  APIGuildChannel,
} from "discord-api-types/v10"

import { updateModule } from "@/lib/actions"

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

import { Label } from "@/components/ui/label"

import {
  ChannelSelect,
  SelectFallback,
} from "@/components/dashboard/modules/select"


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


export const ModuleForm = (props: {
  defaultValues: z.TypeOf<typeof formSchema>,
  data: {
    channels: APIGuildChannel<GuildChannelType>[],
  },
}) => {
  const channels = props.data.channels
  const router = useRouter()

  return formBuilder({
    defaultValues: props.defaultValues,
    onSubmit: (data) => updateModule("AuditLogs", data),
    schema: formSchema,
  },
  ({ form }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="channels.server"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Logs</FormLabel>
              <FormControl>
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildText} showCategories />
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
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildText} showCategories />
              </FormControl>
              <FormDescription>Logs for message deletes and edits</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channels.members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Logs</FormLabel>
              <FormControl>
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildText} showCategories />
              </FormControl>
              <FormDescription>Logs for member joins, leaves and edits</FormDescription>
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
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildText} showCategories />
              </FormControl>
              <FormDescription>Logs for voice channel joins, leaves, mutes, and deafens</FormDescription>
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
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildText} showCategories />
              </FormControl>
              <FormDescription>Logs for invite creates and usage</FormDescription>
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
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildText} showCategories />
              </FormControl>
              <FormDescription>Logs for bans, timeouts, and warns</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="submit" className="mr-3">Save Changes</Button>
      <Button type="reset" variant={"destructive"} onClick={() => router.back()}>Discard Changes</Button>
    </div>
  ))
}


export const ModuleFormFallback = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>Server Logs</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">Logs for channels, roles, boosts, and emojis</p>
      </div>
      <div className="space-y-2">
        <Label>Message Logs</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">Logs for message deletes and edits</p>
      </div>
      <div className="space-y-2">
        <Label>Member Logs</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">Logs for member joins, leaves and edits</p>
      </div>
      <div className="space-y-2">
        <Label>Voice Logs</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">Logs for voice channel joins, leaves, mutes, and deafens</p>
      </div>
      <div className="space-y-2">
        <Label>Invite Logs</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">Logs for invite creates and usage</p>
      </div>
      <div className="space-y-2">
        <Label>Punishment Logs</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">Logs for bans, timeouts, and warns</p>
      </div>
    </div>
    <Button type="submit" className="mr-3">Save Changes</Button>
    <Button type="reset" variant={"destructive"}>Discard Changes</Button>
  </div>
)