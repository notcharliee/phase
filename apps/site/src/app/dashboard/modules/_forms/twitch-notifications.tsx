"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { Label } from "@radix-ui/react-label"
import { ModuleId } from "@repo/utils/modules"
import { useFieldArray, useFormContext } from "react-hook-form"

import { SelectChannel } from "~/components/dashboard/select/channel"
import { SelectMention } from "~/components/dashboard/select/mention"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const TwitchNotifications = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFields = form.watch()[ModuleId.TwitchNotifications]!
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.TwitchNotifications}.streamers`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.TwitchNotifications}.streamers`}
        render={() => (
          <FormItem className="space-y-4">
            {formFieldArray.fields.map((field, index) => {
              const baseName =
                `${ModuleId.TwitchNotifications}.streamers.${index}` as const

              const streamerName = formFields.streamers[index]?.id?.length
                ? formFields.streamers[index]?.id
                : "Unknown Streamer"

              return (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                    <CardTitle>{streamerName}</CardTitle>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => formFieldArray.remove(index)}
                    >
                      <Label className="sr-only">Delete Notification</Label>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 border-t pt-6">
                    <FormField
                      control={form.control}
                      name={`${baseName}.id`}
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
                      name={`${baseName}.channel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Channel</FormLabel>
                          <FormControl>
                            <SelectChannel {...field} />
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
                      name={`${baseName}.mention`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Mention</FormLabel>
                          <FormControl>
                            <SelectMention {...field} />
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
              )
            })}
            <Button
              type="button"
              variant="outline"
              disabled={formFieldArray.fields.length >= 5}
              onClick={() =>
                formFieldArray.append({
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
    </FormItem>
  )
}
