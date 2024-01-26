"use client"

import {
  ChannelType,
  type GuildChannelType,
  type APIGuildChannel,
} from "discord-api-types/v10"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { updateModule } from "@/lib/actions"

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useForm } from "react-hook-form"

import { Label } from "@/components/ui/label"

import {
  ChannelSelect,
  SelectFallback,
} from "@/components/dashboard/modules/select"

import { toast } from "sonner"


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

type FormValues = z.infer<typeof formSchema>


export const ModuleForm = (props: {
  defaultValues: FormValues,
  data: {
    channels: APIGuildChannel<GuildChannelType>[],
  },
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const onSubmit = (data: FormValues) => {
    toast.promise(updateModule("AuditLogs", data), {
      loading: "Saving changes...",
      success: "Changes saved!",
      error: "An error occured.",
    })
  }

  const channels = props.data.channels

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit">Update module</Button>
      </form>
    </Form>
  )
}


export const ModuleFormFallback = () => (
  <></>
)