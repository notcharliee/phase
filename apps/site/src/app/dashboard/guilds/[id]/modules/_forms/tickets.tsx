"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { SelectChannel } from "~/components/dashboard/select/channel"
import { SelectRole } from "~/components/dashboard/select/role"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormControl,
  FormDescription,
  FormField,
  FormFieldArray,
  FormHeader,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { RichTextarea } from "~/components/ui/richtext/textarea"

import type { ModulesFormReturn, ModulesFormValues } from "~/types/dashboard"

export const Tickets = () => {
  const form = useFormContext<ModulesFormValues>()

  return (
    <div className="space-y-8">
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
                placeholder="Example: Create a ticket."
                {...field}
              />
            </FormControl>
            <FormDescription>
              The panel message to send to the channel
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
                className="appearance-none"
                type="number"
                placeholder="5"
                min={1}
                max={100}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Limit the number of open tickets per member
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <TicketsFieldArray form={form} />
    </div>
  )
}

function TicketsFieldArray(props: { form: ModulesFormReturn }) {
  const form = props.form
  const formFields = form.watch()
  const ticketFields = formFields[ModuleId.Tickets]!

  return (
    <FormFieldArray
      control={form.control}
      name={`${ModuleId.Tickets}.tickets`}
      render={({ fields, append, remove }) => (
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
                  {fields.map((field, index) => {
                    const baseName =
                      `${ModuleId.Tickets}.tickets.${index}` as const

                    const ticketName =
                      ticketFields.tickets[index]?.name ?? `Ticket ${index + 1}`

                    return (
                      <Card key={field.id}>
                        <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                          <CardTitle>{ticketName}</CardTitle>
                          <Button
                            aria-label="Delete Ticket"
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => remove(index)}
                          >
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
                    disabled={fields.length >= 5}
                    onClick={() =>
                      append({
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
      )}
    />
  )
}
