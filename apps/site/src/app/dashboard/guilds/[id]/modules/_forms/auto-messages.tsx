"use client"

import { TrashIcon } from "@radix-ui/react-icons"
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
import { Label } from "~/components/ui/label"
import { RichTextarea } from "~/components/dashboard/richtext/textarea"

import type { autoMessagesSchema, modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export type FormValues = z.infer<typeof autoMessagesSchema>

export const AutoMessages = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFields = form.watch()[ModuleId.AutoMessages]!
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.AutoMessages}.messages`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.AutoMessages}.messages`}
        render={() => (
          <FormItem className="space-y-4">
            {formFieldArray.fields.map((field, index) => {
              const baseName =
                `${ModuleId.AutoMessages}.messages.${index}` as const

              const autoMessageName = formFields.messages[index]?.name.length
                ? formFields.messages[index]?.name
                : `Auto Message ${index + 1}`

              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={baseName}
                  render={() => (
                    <Card>
                      <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                        <CardTitle>{autoMessageName}</CardTitle>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => formFieldArray.remove(index)}
                        >
                          <Label className="sr-only">Delete Auto Message</Label>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6 border-t pt-6">
                        <FormField
                          control={form.control}
                          name={`${baseName}.name`}
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
                          name={`${baseName}.content`}
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
                          name={`${baseName}.channel`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Channel</FormLabel>
                              <FormControl>
                                <SelectChannel {...field} />
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
                          name={`${baseName}.mention`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mention</FormLabel>
                              <FormControl>
                                <SelectMention {...field} />
                              </FormControl>
                              <FormDescription>
                                Who to ping in the message
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`${baseName}.interval`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interval</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Example: 1 day"
                                  {...field}
                                />
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
                  )}
                />
              )
            })}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                formFieldArray.append({
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
    </FormItem>
  )
}
