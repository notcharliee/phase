"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { ChannelType } from "discord-api-types/v10"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
import { SelectMention } from "~/components/dashboard/select-mention"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
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
import { RichTextarea } from "~/components/ui/slate"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { safeMs } from "~/lib/utils"

import { updateAutoMessages } from "~/app/dashboard/_actions/updateModule"
import { autoMessagesSchema } from "~/validators/modules"

import type { z } from "zod"

export type FormValues = z.infer<typeof autoMessagesSchema>

export const AutoMessages = () => {
  const dashboard = useDashboardContext()
  const moduleData = dashboard.guild.modules?.[ModuleId.AutoMessages]

  const form = useForm<FormValues>({
    resolver: zodResolver(autoMessagesSchema),
    defaultValues: moduleData
      ? {
          enabled: moduleData.enabled,
          messages: moduleData.messages.map((msg) => ({
            ...msg,
            interval: safeMs(msg.interval, { long: true })!,
          })),
        }
      : {
          enabled: false,
          messages: [
            {
              name: "",
              channel: "",
              content: "",
              interval: "",
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

    toast.promise(updateAutoMessages(data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules[ModuleId.AutoMessages] = updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
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
                    <CardTitle>
                      {formFields.messages[index]?.name.length
                        ? formFields.messages[index]?.name
                        : `Auto Message ${index + 1}`}
                    </CardTitle>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => fieldArray.remove(index)}
                    >
                      <Label className="sr-only">Delete Auto Message</Label>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 border-t pt-6">
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
                            What to call the message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`messages.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <RichTextarea
                              placeholder="Example: Do your daily duolingo lesson."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            What to put in the message
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
                      name={`messages.${index}.mention`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mention</FormLabel>
                          <FormControl>
                            <SelectMention roles={roles} {...field} />
                          </FormControl>
                          <FormDescription>
                            Who to ping in the message (optional)
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
                            How often the message should be sent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  fieldArray.append({
                    name: "",
                    channel: "",
                    content: "",
                    interval: "",
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
