"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  ChannelType,
  type GuildChannelType,
  type APIGuildChannel,
  type APIRole,
} from "discord-api-types/v10"

import { Button } from "@/components/ui/button"
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
import { SelectChannel } from "@/app/dashboard/components/select/channel"
import { SelectRole } from "@/app/dashboard/components/select/role"
import { toast } from "sonner"

import { updateModule } from "@/lib/actions"
import { addChannelSubscription, getTwitchUserByName } from "./actions"

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
        z.union([
          z.literal("stream.online"),
          z.literal("stream.offline"),
        ]),
      ),
      mention: z.string().optional(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

interface ModuleFormProps {
  defaultValues: FormValues
  data: {
    channels: APIGuildChannel<GuildChannelType>[]
    roles: APIRole[]
  }
}

export const ModuleForm = <Fallback extends boolean>(
  props: Fallback extends true
    ? Partial<ModuleFormProps> & { fallback: Fallback }
    : ModuleFormProps & { fallback?: Fallback },
) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const onSubmit = async (data: FormValues) => {
    data.enabled = true

    const promises = data.streamers.map(async (streamer) => {
      const user = await getTwitchUserByName(streamer.id)

      if (user) {
        streamer.id = user.id
        return addChannelSubscription(user.id)
      }
      else throw new Error("The streamer was not found")
    })

    toast.promise(Promise.all(promises), {
      loading: "Fetching streamers...",
      success: () => {
        toast.promise(updateModule("TwitchNotifications", data), {
          loading: "Saving changes...",
          success: "Changes saved!",
          error: "An error occured.",
        })

        return "Streamers fetched!"
      },
      error: (error) => {
        console.log(error)

        form.setError("streamers.0.id", {
          type: "manual",
          message: "The streamer was not found",
        })

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
                {props.fallback ? (
                  <SelectChannel fallback />
                ) : (
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={props.data.channels}
                    {...field}
                  />
                )}
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
                {props.fallback ? (
                  <SelectRole fallback />
                ) : (
                  <SelectRole roles={props.data.roles} {...field} />
                )}
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
        <div className="flex space-x-3">
          <Button type="submit">Save changes</Button>
          <Button
            type="reset"
            variant={"destructive"}
            disabled={!form.formState.isDirty}
            onClick={() => form.reset(props.defaultValues)}
          >
            Undo changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
