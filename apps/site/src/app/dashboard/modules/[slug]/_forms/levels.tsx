"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { ChannelType } from "discord-api-types/v10"

import { TrashIcon } from "@radix-ui/react-icons"

import { SelectChannel } from "@/app/dashboard/components/select/channel"
import { SelectRole } from "@/app/dashboard/components/select/role"
import { Button } from "@/components/ui/button"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { updateModule } from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

const formSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "Channel is required",
  }),
  message: z
    .string()
    .min(1, {
      message: "Message is required",
    })
    .max(2000, {
      message: "Message must be less than 2000 characters",
    }),
  background: z
    .string()
    .url()
    .max(256, {
      message: "Background must be less than 256 characters",
    })
    .refine((value) => value.match(/\.(jpeg|jpg|png)$/), {
      message: "Background must be a valid PNG or JPEG image URL",
    })
    .optional(),
  mention: z.boolean(),
  roles: z
    .array(
      z.object({
        level: z.number().min(1).max(100).int(),
        role: z.string(),
      }),
    )
    .max(100),
})

type FormValues = z.infer<typeof formSchema>

export const Levels = (props: ModuleFormProps<"Levels">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues ?? {
      enabled: false,
      channel: "",
      message: "",
      background: undefined,
      mention: false,
      roles: [],
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldArray = useFieldArray({
    control: form.control,
    name: "roles",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateModule("Levels", data), {
      loading: "Saving changes...",
      success: () => {
        setIsSubmitting(false)
        form.reset(data)
        return "Changes saved!"
      },
      error: () => {
        setIsSubmitting(false)
        return "An error occured."
      },
    })
  }

  const { channels, roles } = props.data.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`{member} you levelled up to level **{member.level}**! 🎉\nYour new XP target is **{member.target}** XP.`}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The message to send on member level-ups
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4 space-y-1">
                  <FormLabel>Reply Type</FormLabel>
                  <FormDescription>
                    How the bot should alert members of level-ups
                  </FormDescription>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="dm" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Send them a DM
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="reply" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Reply in the same channel
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value={
                            field.value &&
                            field.value !== "dm" &&
                            field.value !== "reply"
                              ? field.value
                              : "channel"
                          }
                          checked={
                            !!(
                              field.value &&
                              field.value !== "dm" &&
                              field.value !== "reply"
                            )
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Send a message to another channel
                      </FormLabel>
                    </FormItem>
                    {props.data &&
                      field.value &&
                      field.value !== "reply" &&
                      field.value !== "dm" && (
                        <FormItem className="flex max-w-xs items-center space-x-3 space-y-0">
                          <div className="relative h-9 w-4">
                            <div className="border-muted-foreground absolute -top-3 ml-2 h-[30px] w-[19px] rounded-bl-md border-b border-l"></div>
                          </div>
                          <FormControl>
                            <SelectChannel
                              categories
                              channelType={ChannelType.GuildText}
                              channels={channels}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mention"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4 space-y-1">
                  <FormLabel>Ping on Level-Up</FormLabel>
                  <FormDescription>
                    Whether or not members should be pinged on level-ups
                  </FormDescription>
                </div>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {field.value
                      ? "Yes, members should be pinged"
                      : "No, members shouldn't be pinged"}
                  </FormLabel>
                </FormItem>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Level-Up Roles</Label>
            <p className="text-muted-foreground text-sm">
              The roles to assign on member level-ups
            </p>
          </div>
          {!!fieldArray.fields.length && (
            <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
              {fieldArray.fields.map((field, index) => (
                <FormItem className="flex gap-3 space-y-0" key={field.id}>
                  <FormField
                    key={index}
                    control={form.control}
                    name={`roles.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="appearance-none"
                            type="number"
                            placeholder="LVL"
                            min={1}
                            max={100}
                            {...field}
                            onChange={(event) =>
                              field.onChange(parseInt(event.target.value, 10))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`roles.${index}.role`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <SelectRole roles={roles} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fieldArray.remove(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </FormItem>
              ))}
            </div>
          )}
          {fieldArray.fields.length < 100 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fieldArray.append({ level: 1, role: "" })}
            >
              Add Role
            </Button>
          )}
        </div>
        <Separator />
        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Image</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/image.png"
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex items-center gap-[0.5ch]">
                <p>The background image for the</p>
                <pre className="text-foreground flex h-5 items-center rounded border px-1 font-mono text-xs">
                  <code>/level rank</code>
                </pre>
                <p>command</p>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
