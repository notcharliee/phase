"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { ChannelType } from "discord-api-types/v10"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
import { SelectRole } from "~/components/dashboard/select-role"
import { Checkbox } from "~/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateTwitchNotifications } from "~/app/dashboard/_actions/updateModule"
import { twitchNotificationsSchema } from "~/validators/modules"

import type { z } from "zod"

type FormValues = z.infer<typeof twitchNotificationsSchema>

export const TwitchNotifications = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(twitchNotificationsSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.TwitchNotifications]
      ? {
          ...dashboard.guild.modules[ModuleId.TwitchNotifications],
          streamers: dashboard.guild.modules[
            ModuleId.TwitchNotifications
          ]?.streamers.map((streamer, index) => ({
            ...streamer,
            id: (
              dashboard.guild.modules![ModuleId.TwitchNotifications]!._data
                .streamerNames as string[]
            )[index],
          })),
        }
      : {
          enabled: false,
          streamers: [
            {
              id: "",
              channel: "",
              events: [],
              mention: undefined,
            },
          ],
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateTwitchNotifications(data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules[ModuleId.TwitchNotifications] =
            updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
  }

  const events = [
    {
      id: "stream.online",
      label: "Streamer goes live",
    },
    {
      id: "stream.offline",
      label: "Streamer goes offline",
    },
  ] as const

  const { roles, channels } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="streamers.0.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Streamer Name</FormLabel>
              <FormControl>
                <Input placeholder="Example: sirrac85" {...field} />
              </FormControl>
              <FormDescription>
                The name of the Twitch streamer to listen for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streamers.0.channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Channel</FormLabel>
              <FormControl>
                <SelectChannel
                  categories
                  channelType={ChannelType.GuildText}
                  channels={channels}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The channel to send notifications to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streamers.0.mention"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Mention</FormLabel>
              <FormControl>
                <SelectRole roles={roles} {...field} />
              </FormControl>
              <FormDescription>
                The role to ping when the streamer goes live
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streamers.0.events"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Stream Events</FormLabel>
                <FormDescription>
                  Select the events you want notifications for
                </FormDescription>
              </div>
              {events.map((event) => (
                <FormField
                  key={event.id}
                  control={form.control}
                  name="streamers.0.events"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={event.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(event.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, event.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== event.id,
                                    ),
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {event.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
