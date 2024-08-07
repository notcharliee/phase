"use client"

import { useState } from "react"

import { ChannelType } from "@discordjs/core/http-only"
import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 as randomUUID } from "uuid"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
import { SelectRole } from "~/components/dashboard/select-role"
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
import { Textarea } from "~/components/ui/textarea"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateTickets } from "~/app/dashboard/_actions/updateModule"
import { ticketsSchema } from "~/validators/modules"

import type { APIMessage } from "@discordjs/core/http-only"
import type { z } from "zod"

type FormValues = z.infer<typeof ticketsSchema>

export const Tickets = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(ticketsSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.Tickets]
      ? {
          ...dashboard.guild.modules[ModuleId.Tickets],
          message:
            (
              dashboard.guild.modules[ModuleId.Tickets]._data.message as
                | APIMessage
                | undefined
            )?.embeds[0]?.description ?? "",
        }
      : {
          enabled: true,
          channel: "",
          message: "",
          max_open: undefined,
          tickets: [],
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldArray = useFieldArray({
    control: form.control,
    name: "tickets",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateTickets(data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules[ModuleId.Tickets] = updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
  }

  const { roles, channels } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="channel"
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
                The channel to create tickets from
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Example: Create a ticket."
                  autoResize
                  {...field}
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
          name="max_open"
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
                  onChange={(event) =>
                    field.onChange(parseInt(event.target.value, 10))
                  }
                />
              </FormControl>
              <FormDescription>
                Limit the number of open tickets per member
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Tickets</Label>
            <p className="text-muted-foreground text-sm">
              The tickets you want members to be able to create (max 5)
            </p>
          </div>
          {!!fieldArray.fields.length &&
            fieldArray.fields.map((fieldArrayfield, index) => (
              <Card key={fieldArrayfield.id}>
                <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                  <CardTitle>{fieldArray.fields[index]?.name}</CardTitle>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => fieldArray.remove(index)}
                  >
                    <Label className="sr-only">Delete Counter</Label>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6 border-t pt-6">
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Example: Support" {...field} />
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
                    name={`tickets.${index}.mention`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mention</FormLabel>
                        <FormControl>
                          <SelectRole roles={roles} {...field} />
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
                    name={`tickets.${index}.message`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Example: Staff will be with you shortly."
                            autoResize
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
            ))}
          {fieldArray.fields.length < 5 && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                fieldArray.append({
                  id: randomUUID(),
                  name: "New Ticket",
                  message: "",
                })
              }
            >
              Add Ticket
            </Button>
          )}
        </div>
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
