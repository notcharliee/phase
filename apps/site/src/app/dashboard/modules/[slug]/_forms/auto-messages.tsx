"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import ms from "ms"

import { ChannelType } from "discord-api-types/v10"

import { TrashIcon } from "@radix-ui/react-icons"

import { EmbedPreview } from "@/components/embed-preview"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { SelectChannel } from "../../../components/select/channel"
import { SelectRole } from "../../../components/select/role"

import { addAutoMessages } from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

const formSchema = z.object({
  enabled: z.boolean(),
  messages: z.array(
    z.object({
      name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name cannot be longer than 100 characters"),
      channel: z.string().min(1, "Channel is required"),
      message: z
        .string()
        .min(1, "Message is required")
        .max(2000, "Message cannot be longer than 2000 characters"),
      mention: z.string().optional(),
      interval: z.string().min(2).max(100),
      startAt: z
        .date()
        .min(new Date(), "Date cannot be in the past")
        .optional(),
    }),
  ),
})

export type FormValues = z.infer<typeof formSchema>

export const AutoMessages = (props: ModuleFormProps<"AutoMessages">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues
      ? {
          enabled: props.defaultValues.enabled,
          messages: props.defaultValues.messages.map((message) => ({
            ...message,
            interval: ms(message.interval, { long: true }),
            startAt: new Date(Date.now() + message.interval),
          })),
        }
      : {
          enabled: false,
          messages: [],
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const formFields = form.watch()

  const fieldArray = useFieldArray({
    control: form.control,
    name: "messages",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    const intervals = []

    for (let i = 0; i < data.messages.length; i++) {
      let newTime: number | undefined

      try {
        newTime = ms(data.messages[i]!.interval)
      } finally {
        if (newTime) {
          intervals.push(newTime)
          data.messages[i]!.interval = newTime.toString()
        } else {
          form.setError(
            `messages.${i}.interval`,
            {
              type: "manual",
              message: "Invalid time format",
            },
            { shouldFocus: true },
          )

          setIsSubmitting(false)
        }
      }
    }

    if (intervals.length === data.messages.length) {
      toast.promise(addAutoMessages(data), {
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
  }

  const { channels, roles } = props.data.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={`messages`}
          render={() => (
            <FormItem className="space-y-4">
              {fieldArray.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-5">
                    <div className="flex flex-col">
                      <CardTitle>
                        {formFields.messages[index]?.name.length
                          ? formFields.messages[index]?.name
                          : `Auto Message ${index + 1}`}
                      </CardTitle>
                      <CardDescription>
                        {channels.find(
                          (channel) =>
                            channel.id === formFields.messages[index]?.channel,
                        )?.name
                          ? "# " +
                            channels.find(
                              (channel) =>
                                channel.id ===
                                formFields.messages[index]?.channel,
                            )?.name
                          : "Select a channel"}
                      </CardDescription>
                    </div>
                    <Button
                      variant={"destructive"}
                      className="max-sm:hidden"
                      onClick={() => fieldArray.remove(index)}
                    >
                      <div>Delete Message</div>
                    </Button>
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      className="sm:hidden"
                      onClick={() => fieldArray.remove(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 border-y pt-6">
                    <FormField
                      control={form.control}
                      name={`messages.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Spanish or vanish" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of the message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`messages.${index}.channel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel</FormLabel>
                          <FormControl>
                            <SelectChannel
                              categories
                              channelType={ChannelType.GuildText}
                              channels={channels}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Where to send the message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`messages.${index}.message`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Do your daily duolingo lesson."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>The message to send</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`messages.${index}.mention`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mention</FormLabel>
                          <FormControl>
                            <SelectRole roles={roles} {...field} />
                          </FormControl>
                          <FormDescription>
                            The role to mention (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`messages.${index}.interval`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interval</FormLabel>
                          <FormControl>
                            <Input placeholder="1 day" {...field} />
                          </FormControl>
                          <FormDescription>
                            How often to send the message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start space-y-4 py-5">
                    <CardTitle>Message Preview</CardTitle>
                    <EmbedPreview
                      title={
                        formFields.messages[index]?.name.length
                          ? formFields.messages[index]?.name
                          : "Reminder"
                      }
                      description={formFields.messages[index]?.message}
                      mention={
                        formFields.messages[index]?.mention &&
                        formFields.messages[index]?.mention?.length !== 0
                          ? roles.find(
                              (role) =>
                                role.id === formFields.messages[index]?.mention,
                            )?.name ?? "unknown"
                          : undefined
                      }
                    />
                    <CardDescription className="italic">
                      Fun Fact: Auto Messages are built on top of reminders. The
                      only difference is Auto Messages loop, whereas reminders
                      get deleted after they expire. This is why, when no name
                      is provided, the default embed title is {`"Reminder"`}
                    </CardDescription>
                  </CardFooter>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  fieldArray.append({
                    name: "",
                    channel: "",
                    message: "",
                    mention: undefined,
                    interval: "",
                    startAt: new Date(),
                  })
                }
              >
                Add Message
              </Button>
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
