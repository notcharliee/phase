"use client"

import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { v4 as randomUUID } from "uuid"

import {
  ChannelType,
  type GuildChannelType,
  type APIGuildChannel,
  type APIButtonComponentWithCustomId,
  type APIMessage,
  ButtonStyle,
} from "discord-api-types/v10"

import { TrashIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
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
import { toast } from "sonner"

import { updateModule, updateModuleMessage } from "@/lib/actions"

const formSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "You must select a channel",
  }),
  forms: z.array(
    z.object({
      id: z.string(),
      name: z
        .string()
        .min(1, {
          message: "Name must be at least 1 character",
        })
        .max(32, {
          message: "Name cannot be longer than 32 characters",
        }),
      channel: z.string().min(1, {
        message: "You must select a channel",
      }),
      questions: z
        .array(
          z.object({
            question: z
              .string()
              .min(1, {
                message: "Question must be at least 1 character",
              })
              .max(100, {
                message: "Question cannot be longer than 100 characters",
              }),
          }),
        )
        .min(1)
        .max(100),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

interface ModuleFormProps {
  defaultValues: FormValues
  data: {
    channels: APIGuildChannel<GuildChannelType>[]
    messages: APIMessage[]
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
    name: "forms",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    toast.promise(
      updateModule("Forms", {
        ...data,
        forms: data.forms.map((form) => ({
          ...form,
          questions: form.questions.map((q) => q.question),
        })),
      }),
      {
        loading: "Saving changes...",
        success: (newData) => {
          for (const form of newData.forms) {
            const oldMessage = props.data?.messages.find((message) => {
              const button = message.components?.at(0)?.components[0] as
                | APIButtonComponentWithCustomId
                | undefined

              if (button && button.custom_id.endsWith(form.id)) return true
            })

            toast.promise(
              updateModuleMessage(form.channel, oldMessage, {
                components: [
                  {
                    components: [
                      {
                        custom_id: `form.start.${form.id}`,
                        label: form.name,
                        style: ButtonStyle.Secondary,
                        type: 2,
                      },
                    ],
                    type: 1,
                  },
                ],
                embeds: [
                  {
                    color: parseInt("f8f8f8", 16),
                    title: `${form.name}`,
                    description: `Press the button below to start filling out the form.`,
                    footer: {
                      text: `${form.questions.length} questions in total.`,
                    },
                  },
                ],
              }),
              {
                loading: `${oldMessage ? "Resending" : "Sending"} ${form.name} message...`,
                success: (newTicketMessage) => {
                  if (oldMessage)
                    props.data!.messages[
                      props.data!.messages.indexOf(oldMessage)
                    ] = newTicketMessage
                  else props.data!.messages.push(newTicketMessage)
                  return `${form.name} message ${oldMessage ? "resent" : "sent"}!`
                },
                error: "An error occured.",
              },
            )
          }

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
                Where to send submitted form responses (keep private)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`forms`}
          render={() => (
            <FormItem className="space-y-4">
              {fieldArray.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-5">
                    <div className="flex flex-col space-y-1.5">
                      <CardTitle>{formFields.forms[index]?.name}</CardTitle>
                      <CardDescription>
                        {props.data?.channels.find(
                          (channel) =>
                            channel.id === formFields.forms[index]?.channel,
                        )?.name
                          ? "# " +
                            props.data.channels.find(
                              (channel) =>
                                channel.id === formFields.forms[index]?.channel,
                            )?.name
                          : "Select a channel"}
                      </CardDescription>
                    </div>
                    <Button
                      variant={"destructive"}
                      onClick={() => fieldArray.remove(index)}
                    >
                      <div className="hidden sm:block">Delete Form</div>
                      <TrashIcon className="block h-4 w-4 sm:hidden" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 border-t pt-6">
                    <FormField
                      control={form.control}
                      name={`forms.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Example" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of the form
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`forms.${index}.channel`}
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
                            Where to send the create form message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormQuestions form={form} formIndex={index} />
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  fieldArray.append({
                    id: randomUUID(),
                    name: `Form ${formFields.forms.length + 1}`,
                    channel: "",
                    questions: [],
                  })
                }
              >
                Add Form
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

const FormQuestions = (props: {
  form: UseFormReturn<FormValues, unknown, FormValues>
  formIndex: number
}) => {
  const fieldArray = useFieldArray({
    control: props.form.control,
    name: `forms.${props.formIndex}.questions`,
  })

  return (
    <FormField
      control={props.form.control}
      name={`forms.${props.formIndex}.questions`}
      render={() => (
        <FormItem className="space-y-4">
          {fieldArray.fields.map((field, index) => (
            <FormField
              key={field.id}
              control={props.form.control}
              name={`forms.${props.formIndex}.questions.${index}.question`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question {index + 1}</FormLabel>
                  <FormControl>
                    <div className="flex gap-3">
                      <Input placeholder="Are you super cool?" {...field} />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fieldArray.remove(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              fieldArray.append({
                question: "",
              })
            }
          >
            Add Question
          </Button>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
