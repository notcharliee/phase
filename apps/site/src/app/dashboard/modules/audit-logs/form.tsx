"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  ChannelType,
  type GuildChannelType,
  type APIGuildChannel,
} from "discord-api-types/v10"

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
import { SelectChannel } from "../../components/select/channel"
import { toast } from "sonner"

import { updateModule } from "@/lib/actions"

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

interface ModuleFormProps {
  defaultValues: FormValues
  data: {
    channels: APIGuildChannel<GuildChannelType>[]
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

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    toast.promise(
      updateModule("AuditLogs", {
        ...data,
        channels: Object.fromEntries(
          Object.entries(data.channels).map(([k, v]) => [k, v ?? null]),
        ) as Record<keyof typeof data.channels, string | null>,
      }),
      {
        loading: "Saving changes...",
        success: "Changes saved!",
        error: "An error occured.",
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="channels.server"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Logs</FormLabel>
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
                  Logs for warns, mutes, kicks, and bans
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
