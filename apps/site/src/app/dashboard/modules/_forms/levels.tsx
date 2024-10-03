"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useFormContext } from "react-hook-form"

import { SelectChannel } from "~/components/dashboard/select/channel"
import { SelectRole } from "~/components/dashboard/select/role"
import { Button } from "~/components/ui/button"
import { Codeblock } from "~/components/ui/codeblock"
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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { RichTextarea } from "~/components/dashboard/richtext/textarea"
import { Switch } from "~/components/ui/switch"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const Levels = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.Levels}.roles`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.Levels}.message`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <RichTextarea
                placeholder={`Example: {member} you are now level **{member.level}**! 🎉\nYour new target is **{member.target}** XP.`}
                {...field}
              />
            </FormControl>
            <FormDescription>
              The message to send on member level-ups
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.Levels}.channel`}
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormHeader>
              <FormLabel>Reply Type</FormLabel>
              <FormDescription>
                How the bot should alert members of level-ups
              </FormDescription>
            </FormHeader>
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
                  <FormLabel className="font-normal">Send them a DM</FormLabel>
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
                        field.value &&
                        field.value !== "dm" &&
                        field.value !== "reply"
                      }
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Send a message to another channel
                  </FormLabel>
                </FormItem>
                {field.value &&
                  field.value !== "reply" &&
                  field.value !== "dm" && (
                    <FormItem className="flex max-w-xs items-center space-x-3 space-y-0">
                      <div className="relative h-9 w-4">
                        <div className="border-muted-foreground absolute -top-3 ml-2 h-[30px] w-[19px] rounded-bl-md border-b border-l" />
                      </div>
                      <FormControl>
                        <SelectChannel {...field} />
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
        name={`${ModuleId.Levels}.mention`}
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormHeader>
              <FormLabel>Mention</FormLabel>
              <FormDescription>
                Whether or not members should be pinged on level-ups
              </FormDescription>
            </FormHeader>
            <FormControl>
              <div className="flex items-center space-x-3 space-y-0">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label className="font-normal">
                  {field.value
                    ? "Yes, members should be pinged"
                    : "No, members shouldn't be pinged"}
                </Label>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.Levels}.roles`}
        render={() => (
          <FormItem className="space-y-4">
            <FormHeader>
              <FormLabel>Role Rewards</FormLabel>
              <FormDescription>
                The roles to assign when a member reaches a new milestone
              </FormDescription>
            </FormHeader>
            <FormControl>
              <div className="space-y-4">
                {formFieldArray.fields.map((field, index) => {
                  const baseName = `${ModuleId.Levels}.roles.${index}` as const

                  return (
                    <FormItem className="flex gap-2 space-y-0" key={field.id}>
                      <FormField
                        control={form.control}
                        name={`${baseName}.level`}
                        render={({ field }) => (
                          <FormItem className="w-1/3 space-y-0">
                            <FormLabel className="sr-only">Level</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="appearance-none"
                                type="number"
                                placeholder="Example: 5"
                                min={1}
                                max={100}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`${baseName}.role`}
                        render={({ field }) => (
                          <FormItem className="w-full space-y-0">
                            <FormLabel className="sr-only">Role</FormLabel>
                            <FormControl>
                              <SelectRole {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => formFieldArray.remove(index)}
                      >
                        <Label className="sr-only">Delete Level-Up Role</Label>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </FormItem>
                  )
                })}
                <Button
                  type="button"
                  variant="outline"
                  disabled={formFieldArray.fields.length >= 100}
                  onClick={() => formFieldArray.append({ level: 1, role: "" })}
                >
                  Add Role
                </Button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.Levels}.background`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Background Image</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="https://example.com/image.png"
              />
            </FormControl>
            <FormDescription>
              The background image for the{" "}
              <Codeblock inline>/level rank</Codeblock> command
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormItem>
  )
}
