"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import ms from "ms"

import {
  ChannelType,
  type GuildChannelType,
  type APIGuildChannel,
  type APIRole,
} from "discord-api-types/v10"

import { TrashIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
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
import { SelectChannel } from "../../components/select/channel"
import { SelectRole } from "../../components/select/role"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { addAutoMessages } from "./action"

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

interface ModuleFormProps {
  defaultValues: FormValues
  data: {
    channels: APIGuildChannel<GuildChannelType>[]
    roles: APIRole[]
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

  const formFields = form.watch()

  const fieldArray = useFieldArray({
    control: form.control,
    name: "messages",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    const intervals = []

    for (let i = 0; i < data.messages.length; i++) {
      let newTime: number | undefined
      try {
        newTime = ms(data.messages[i]!.interval)
      } catch {
        // do nothing
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
        }
      }
    }

    if (intervals.length === data.messages.length) {
      toast.promise(addAutoMessages(data), {
        loading: "Saving changes...",
        success: "Changes saved!",
        error: "An error occured.",
      })
    }
  }

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
                        {props.data?.channels.find(
                          (channel) =>
                            channel.id === formFields.messages[index]?.channel,
                        )?.name
                          ? "# " +
                            props.data.channels.find(
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
                            {props.fallback ? (
                              <SelectRole fallback />
                            ) : (
                              <SelectRole roles={props.data.roles} {...field} />
                            )}
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
                    <div className="w-full rounded-md border bg-[#2f3136] p-2.5">
                      <div className="flex gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/phase.png"
                          alt=""
                          width={40}
                          height={40}
                          className="max-h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                          <div className="text-foreground flex items-center gap-1">
                            <div className="text-sm font-medium">Phase</div>
                            <div className="flex h-3.5 items-center rounded bg-[#5865F2] px-[5px] text-[8.5px]">
                              BOT
                            </div>
                          </div>
                          {formFields.messages[index]?.mention &&
                            formFields.messages[index]?.mention?.length !==
                              0 && (
                              <div className="w-min rounded-sm bg-[#5865F2]/50 text-sm font-medium leading-tight text-[#c9cdfb]">
                                <span className="whitespace-nowrap px-0.5">
                                  @
                                  {props.data?.roles.find(
                                    (role) =>
                                      role.id ===
                                      formFields.messages[index]?.mention,
                                  )?.name ?? "unknown"}
                                </span>
                              </div>
                            )}
                          <div className="border-foreground mt-0.5 flex max-w-full sm:max-w-[516px] flex-col rounded border-l-4 bg-[#202225] pb-4 pl-3 pr-4 pt-2">
                            <span className="mt-1 text-sm font-semibold break-all">
                              {formFields.messages[index]?.name.length
                                ? formFields.messages[index]?.name
                                : "Reminder"}
                            </span>
                            {formFields.messages[index]?.message.length !==
                              0 && (
                              <p className="mt-1 text-xs break-all">
                                {formFields.messages[index]?.message.split("\n").map((line, index) => (
                                  <span key={index}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="italic">
                      Auto Messages are built on top of reminders. The only
                      difference is Auto Messages loop, whereas reminders get
                      deleted after they expire. This is why, when no name is
                      provided, the default embed title is {`"Reminder"`}
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
        <div className="flex space-x-3">
          <Button type="submit">Save changes</Button>
          <Button
            type="reset"
            variant={"destructive"}
            disabled={!form.formState.isDirty}
            onClick={() => form.reset()}
          >
            Undo changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
