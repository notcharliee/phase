"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ChannelType } from "discord-api-types/v10"

import { SelectChannel } from "@/app/dashboard/components/select/channel"
import { SelectRole } from "@/app/dashboard/components/select/role"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import {
  addChannelSubscription,
  getTwitchUserByName,
  updateModule,
} from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

const formSchema = z.object({
  enabled: z.boolean(),
  streamers: z.array(
    z.object({
      id: z
        .string()
        .min(4, {
          message: "The streamer name must be at least 4 characters",
        })
        .max(25, {
          message: "The streamer name must be less than 25 characters",
        }),
      channel: z.string().min(1, {
        message: "You must select a channel",
      }),
      events: z.array(
        z.union([z.literal("stream.online"), z.literal("stream.offline")]),
      ),
      mention: z.string().optional(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

export const TwitchNotifications = (
  props: ModuleFormProps<"TwitchNotifications">,
) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues ?? {
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

    const promises = data.streamers.map(async (streamer) => {
      const user = await getTwitchUserByName(streamer.id)

      if (user) {
        streamer.id = user.id
        return addChannelSubscription(user.id)
      } else throw new Error("The streamer was not found")
    })

    toast.promise(Promise.all(promises), {
      loading: "Fetching streamers...",
      success: () => {
        setTimeout(() => {
          toast.promise(updateModule("TwitchNotifications", data), {
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
          })
        }, 500)

        return "Streamers fetched!"
      },
      error: (error) => {
        console.log(error)

        form.setError("streamers.0.id", {
          type: "manual",
          message: "The streamer was not found",
        })

        setIsSubmitting(false)

        return "An error occured."
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

  const { roles, channels } = props.data.guild

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
                <Input placeholder="Enter streamer name here" {...field} />
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
