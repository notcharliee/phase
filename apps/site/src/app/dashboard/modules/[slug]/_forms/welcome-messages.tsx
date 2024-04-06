"use client"

import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ChannelType } from "discord-api-types/v10"

import { SelectChannel } from "@/app/dashboard/components/select/channel"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { updateModule } from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

const formSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "Channel is required",
  }),
  message: z.string(),
  mention: z.boolean(),
  card: z.object({
    enabled: z.boolean(),
    background: z.string().url().optional(),
  }),
  // .refine(
  //   (card) =>
  //     card.enabled &&
  //     card.background &&
  //     (card.background.endsWith(".png") ||
  //       card.background.endsWith(".jpg") ||
  //       card.background.endsWith(".jpeg") ||
  //       card.background.endsWith(".webp")),
  //   {
  //     message: "Background image must be either png, jpg, or webp",
  //     path: ["background"]
  //   },
  // ),
})

type FormValues = z.infer<typeof formSchema>

export const WelcomeMessages = (props: ModuleFormProps<"WelcomeMessages">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues ?? {
      enabled: false,
      channel: "",
      message: "",
      mention: false,
      card: {
        enabled: false,
        background: undefined,
      },
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const formFields = form.watch()

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateModule("WelcomeMessages", data), {
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
  }

  const { channels } = props.data.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Channel</FormLabel>
              <FormControl>
                <SelectChannel
                  categories
                  channelType={ChannelType.GuildText}
                  channels={channels}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The channel to send welcome messages to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Hi **{username}**, welcome to the server! You are member #{membercount}.`}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The message to send when a new member joins
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="card"
          render={() => (
            <FormItem className="space-y-4">
              <FormField
                control={form.control}
                name="card.enabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4 space-y-1">
                      <FormLabel>Welcome Cards</FormLabel>
                      <FormDescription>
                        Whether or not to attach a welcome card (see what they
                        look like{" "}
                        <Link
                          href={"https://phasebot.xyz/api/image/welcome.png"}
                        >
                          here
                        </Link>
                        )
                      </FormDescription>
                    </div>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {field.value
                          ? "Yes, attach a welcome card"
                          : "No, don't attach a welcome card"}
                      </FormLabel>
                    </FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="card.background"
                disabled={!formFields?.card?.enabled}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={`https://placehold.co/1200x448.png`}
                        {...field}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value.length > 0
                              ? event.target.value
                              : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Style your welcome card with a custom background
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mention"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4 space-y-1">
                <FormLabel>Mention on join</FormLabel>
                <FormDescription>
                  Whether or not members should be pinged in the welcome message
                </FormDescription>
              </div>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {field.value
                    ? "Yes, members should be pinged"
                    : "No, members shouldn't be pinged"}
                </FormLabel>
              </FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
