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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { SelectChannel } from "../../components/select/channel"
import { toast } from "sonner"

import { updateNewsChannel } from "../actions"

const formSchema = z.object({
  channel: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

export const NewsChannelForm = (props: {
  discordChannels: APIGuildChannel<GuildChannelType>[]
  defaultValues: FormValues
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const onSubmit = (data: FormValues) => {
    if (data.channel?.length === 0) data.channel = null

    console.log(data)

    toast.promise(updateNewsChannel(data.channel ?? undefined), {
      loading: "Saving changes...",
      success: "Changes saved!",
      error: "An error occured.",
    })
  }

  return (
    <Form {...form}>
      <form className="flex gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <SelectChannel
                  channels={props.discordChannels}
                  channelType={ChannelType.GuildText}
                  categories
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
