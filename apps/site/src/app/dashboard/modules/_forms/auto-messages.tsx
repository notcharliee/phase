"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { ChannelType } from "discord-api-types/v10"
import { default as ms } from "ms"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
import { SelectRole } from "~/components/dashboard/select-role"
import { EmbedPreview } from "~/components/embed-preview"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
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
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateAutoMessages } from "~/app/dashboard/_actions/updateModule"
import { autoMessagesSchema } from "~/validators/modules"

import type { z } from "zod"

export type FormValues = z.infer<typeof autoMessagesSchema>

export const AutoMessages = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(autoMessagesSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.AutoMessages]
      ? {
          enabled: dashboard.guild.modules[ModuleId.AutoMessages].enabled,
          messages: dashboard.guild.modules[ModuleId.AutoMessages].messages.map(
            (message) => ({
              ...message,
              interval: ms(message.interval, { long: true }),
              startAt: new Date(Date.now() + message.interval),
            }),
          ),
        }
      : {
          enabled: false,
          messages: [
            {
              channel: "",
              message: "",
              mention: undefined,
              interval: "",
              startAt: new Date(),
            },
          ],
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
      toast.promise(updateAutoMessages(data), {
        loading: "Saving changes...",
        error: "An error occured.",
        success: (updatedModuleData) => {
          form.reset(data)
          dashboard.setData((dashboardData) => {
            if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
            dashboardData.guild.modules[ModuleId.AutoMessages] =
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
  }

  const { channels, roles } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-2">
        <FormField
          control={form.control}
          name="messages"
          render={() => (
            <FormItem className="space-y-4">
              {fieldArray.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                    <CardTitle>{formFields.messages[index]?.name}</CardTitle>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => fieldArray.remove(index)}
                    >
                      <Label className="sr-only">Delete Counter</Label>
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
                            <Input
                              placeholder="Example: Spanish or vanish"
                              {...field}
                            />
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
                              placeholder="Example: Do your daily duolingo lesson."
                              autoResize
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
                            <Input placeholder="Example: 1 day" {...field} />
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
                          ? (roles.find(
                              (role) =>
                                role.id === formFields.messages[index]?.mention,
                            )?.name ?? "unknown")
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
