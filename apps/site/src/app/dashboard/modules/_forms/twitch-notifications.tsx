"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { Label } from "@radix-ui/react-label"
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

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateTwitchNotifications } from "~/app/dashboard/_actions/updateModule"
import { twitchNotificationsSchema } from "~/validators/modules"

import type { z } from "zod"

type FormValues = z.infer<typeof twitchNotificationsSchema>

export const TwitchNotifications = () => {
  const dashboard = useDashboardContext()
  const moduleData = dashboard.guild.modules?.[ModuleId.TwitchNotifications]

  const form = useForm<FormValues>({
    resolver: zodResolver(twitchNotificationsSchema),
    defaultValues: moduleData
      ? {
          ...moduleData,
          streamers: moduleData.streamers.map((streamer, index) => ({
            ...streamer,
            id: (moduleData._data.streamerNames as string[])[index],
          })),
        }
      : {
          enabled: false,
          streamers: [
            {
              id: "",
              channel: "",
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
      error: (error: Error) => (
        <div className="flex flex-col gap-0.5">
          <div data-title>An error occured.</div>
          <div data-description>{error.message}</div>
        </div>
      ),
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

  const fieldArray = useFieldArray({
    control: form.control,
    name: "streamers",
  })

  const formFields = form.watch()

  const { roles, channels } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-2">
        <FormField
          control={form.control}
          name="streamers"
          render={() => (
            <FormItem className="space-y-4">
              {fieldArray.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                    <CardTitle>
                      {formFields.streamers[index]?.id ?? "Unknown Streamer"}
                    </CardTitle>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => fieldArray.remove(index)}
                    >
                      <Label className="sr-only">Delete Notification</Label>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 border-t pt-6">
                    <FormField
                      control={form.control}
                      name={`streamers.${index}.id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Streamer Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Example: sirphase45"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The username of the streamer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`streamers.${index}.channel`}
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
                      name={`streamers.${index}.mention`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Mention</FormLabel>
                          <FormControl>
                            <SelectMention roles={roles} {...field} />
                          </FormControl>
                          <FormDescription>
                            Who to ping when the streamer goes live
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
                disabled={fieldArray.fields.length >= 5}
                onClick={() =>
                  fieldArray.append({
                    id: "",
                    channel: "",
                    mention: undefined,
                  })
                }
              >
                Add Notification
              </Button>
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
