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
  channel: z.string().min(1, {
    message: "Channel is required",
  }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
})

type FormValues = z.infer<typeof formSchema>

export const JoinToCreates = (props: ModuleFormProps<"JoinToCreates">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues ?? {
      enabled: false,
      channel: "",
      category: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateModule("JoinToCreates", data), {
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

    form.reset(data)
  }

  const channels = props.data.guild.channels

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger Channel</FormLabel>
              <FormControl>
                <SelectChannel
                  categories
                  channelType={ChannelType.GuildVoice}
                  channels={channels}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The channel that members join to trigger the module
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <SelectChannel
                  channelType={ChannelType.GuildCategory}
                  channels={channels}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The category where temporary channels will be created
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
