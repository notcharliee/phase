"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { v4 as randomUUID } from "uuid"

import {
  ButtonStyle,
  ChannelType,
  type GuildChannelType,
  type APIGuildChannel,
  type APIMessage,
  APIRole,
} from "discord-api-types/v10"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { SelectChannel } from "../../components/select/channel"
import { SelectRole } from "../../components/select/role"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { updateModuleMessage, updateModule } from "@/lib/actions"

const formSchema = z.object({
  enabled: z.boolean(),
  channel: z.string(),
  message: z.string(),
  max_open: z.number().int().optional(),
  tickets: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        message: z.string(),
        mention: z.string().optional(),
      }),
    )
    .max(5),
})

type FormValues = z.infer<typeof formSchema>

interface ModuleFormProps {
  defaultValues: FormValues
  data: {
    channels: APIGuildChannel<GuildChannelType>[]
    roles: APIRole[]
    message: APIMessage | undefined
  }
}

export const ModuleForm = <Fallback extends boolean>(
  props: Fallback extends true
    ? Partial<ModuleFormProps> & { fallback: Fallback }
    : ModuleFormProps & { fallback?: Fallback },
) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: "tickets",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    toast.promise(
      updateModule("Tickets", {
        enabled: data.enabled,
        channel: data.channel,
        max_open: data.max_open,
        tickets: data.tickets,
      }),
      {
        loading: "Saving changes...",
        success: (newData) => {
          toast.promise(
            updateModuleMessage(newData.channel, props.data?.message, {
              components: [
                {
                  components: newData.tickets.map((ticket) => ({
                    custom_id: `ticket.open.${ticket.id}`,
                    label: ticket.name,
                    style: ButtonStyle.Secondary,
                    type: 2,
                  })),
                  type: 1,
                },
              ],
              embeds: [
                {
                  color: parseInt("f8f8f8", 16),
                  title: "Make a ticket 🎫",
                  description: data.message,
                },
              ],
            }),
            {
              loading: `${props.data?.message ? "Resending" : "Sending"} ticket message...`,
              success: (newTicketMessage) => {
                props.data!.message = newTicketMessage
                return `Ticket message ${props.data?.message ? "resent" : "sent"}!`
              },
              error: "An error occured.",
            },
          )

          return "Changes saved!"
        },
        error: "An error occured.",
      },
    )
  }

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
                {props.fallback ? (
                  <SelectChannel fallback />
                ) : (
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildText}
                    channels={props.data.channels}
                    {...field}
                  />
                )}
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
                {props.fallback ? (
                  <Textarea placeholder="Loading..." {...field} />
                ) : (
                  <Textarea placeholder="Create a ticket." {...field} />
                )}
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
          {!!fieldArray.fields.length && (
            <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
              {fieldArray.fields.map((fieldArrayfield, index) => (
                <Card key={fieldArrayfield.id}>
                  <CardHeader className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`tickets.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Support" {...field} />
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
                          {props.fallback ? (
                            <SelectRole fallback />
                          ) : (
                            <SelectRole roles={props.data.roles} {...field} />
                          )}
                          </FormControl>
                          <FormDescription>
                            The role to mention on ticket create
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name={`tickets.${index}.message`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Staff will be with you shortly."
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
                  <CardFooter>
                    <Button
                      variant={"destructive"}
                      onClick={() => fieldArray.remove(index)}
                    >
                      Delete Ticket
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
        <div className="flex space-x-3">
          <Button type="submit">Save changes</Button>
          <Button
            type="reset"
            variant={"destructive"}
            disabled={!form.formState.isDirty}
            onClick={() => form.reset(props.defaultValues)}
          >
            Undo changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
