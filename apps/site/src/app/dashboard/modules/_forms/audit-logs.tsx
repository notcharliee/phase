"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { ChannelType } from "discord-api-types/v10"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateModule } from "~/app/dashboard/_actions/updateModule"
import { auditLogsSchema } from "~/validators/modules"

import type { z } from "zod"

type FormValues = z.infer<typeof auditLogsSchema>

export const AuditLogs = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(auditLogsSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.AuditLogs]
      ? {
          ...dashboard.guild.modules?.[ModuleId.AuditLogs],
        }
      : {
          enabled: false,
          channels: {
            server: "",
            members: "",
            messages: "",
            punishments: "",
            voice: "",
            invites: "",
          },
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateModule(ModuleId.AuditLogs, data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules[ModuleId.AuditLogs] = updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
  }

  const { channels } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
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
