"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ChannelType } from "discord-api-types/v10"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { SelectChannel } from "../../../components/select/channel"

import { updateModule } from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

const formSchema = z.object({
  enabled: z.boolean(),
  channels: z.object({
    server: z.string().optional().nullable(),
    messages: z.string().optional().nullable(),
    voice: z.string().optional().nullable(),
    invites: z.string().optional().nullable(),
    members: z.string().optional().nullable(),
    punishments: z.string().optional().nullable(),
  }),
})

type FormValues = z.infer<typeof formSchema>

export const AuditLogs = (props: ModuleFormProps<"AuditLogs">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues ?? {
      enabled: false,
      channels: {
        server: null,
        members: null,
        messages: null,
        punishments: null,
        voice: null,
        invites: null,
      },
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(
      updateModule("AuditLogs", {
        ...data,
        channels: Object.fromEntries(
          Object.entries(data.channels).map(([k, v]) => [k, v ?? null]),
        ) as Record<keyof typeof data.channels, string | null>,
      }),
      {
        loading: "Saving changes...",
        success: () => {
          setIsSubmitting(false)
          form.reset(data)
          return "Changes saved!"
        },
        error: () => {
          setIsSubmitting(false)
          return "An error occured."
        },
      },
    )
  }

  const { channels } = props.data.guild

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000"
      >
        <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="channels.server"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Logs</FormLabel>
                <FormControl>
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={channels}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Logs for channels, roles, boosts, and emojis
                </FormDescription>
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
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={channels}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Logs for message deletes and edits
                </FormDescription>
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
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={channels}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Logs for member joins, leaves and edits
                </FormDescription>
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
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={channels}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Logs for voice channel joins, leaves, mutes, and deafens
                </FormDescription>
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
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={channels}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Logs for invite creates and usage
                </FormDescription>
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
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={channels}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Logs for warns, mutes, kicks, and bans
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
