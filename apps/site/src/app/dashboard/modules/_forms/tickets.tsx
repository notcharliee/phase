"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { SelectChannel } from "~/components/dashboard/select-channel"
import { SelectRole } from "~/components/dashboard/select-role"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormControl,
  FormDescription,
  FormField,
  FormHeader,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RichTextarea } from "~/components/ui/slate"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const Tickets = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFields = form.watch()[ModuleId.Tickets]!
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.Tickets}.tickets`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.Tickets}.channel`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Channel</FormLabel>
            <FormControl>
              <SelectChannel {...field} />
            </FormControl>
            <FormDescription>
              The channel to create tickets from
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.Tickets}.message`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <RichTextarea
                {...field}
                placeholder="Example: Create a ticket."
              />
            </FormControl>
            <FormDescription>
              The message to send in the channel
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.Tickets}.max_open`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Open</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="appearance-none"
                type="number"
                placeholder="5"
                min={1}
                max={100}
              />
            </FormControl>
            <FormDescription>
              Limit the number of open tickets per member
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.Tickets}.tickets`}
        render={() => (
          <FormItem className="space-y-4">
            <FormHeader className="space-y-1">
              <FormLabel>Tickets</FormLabel>
              <FormDescription>
                The tickets you want members to be able to create (max 5)
              </FormDescription>
            </FormHeader>
            <FormControl>
              <div className="space-y-4">
                {formFieldArray.fields.map((fieldArrayfield, index) => {
                  const baseName =
                    `${ModuleId.Tickets}.tickets.${index}` as const

                  const ticketName =
                    formFields.tickets[index]?.name ?? `Ticket ${index + 1}`

                  return (
                    <Card key={fieldArrayfield.id}>
                      <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                        <CardTitle>{ticketName}</CardTitle>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => formFieldArray.remove(index)}
                        >
                          <Label className="sr-only">Delete Ticket</Label>
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
                                  placeholder="Example: Support"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                The name of the ticket (used for buttons)
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
                                <SelectRole {...field} />
                              </FormControl>
                              <FormDescription>
                                The role to mention on ticket create
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`${baseName}.message`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <RichTextarea
                                  placeholder="Example: Staff will be with you shortly."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                The message to send on ticket create
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
                      id: randomUUID(),
                      name: "New Ticket",
                      message: "",
                    })
                  }
                >
                  Add Ticket
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormItem>
  )
}
