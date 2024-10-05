"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/utils/modules"
import { useFieldArray, useFormContext } from "react-hook-form"

import { SelectRole } from "~/components/dashboard/select/role"
import { EmojiPicker } from "~/components/emoji-picker"
import { Button } from "~/components/ui/button"
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

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const ReactionRoles = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.ReactionRoles}.reactions`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.ReactionRoles}.messageUrl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="https://discord.com/channels/{guild}/{channel}/{message}"
              />
            </FormControl>
            <FormDescription>
              The URL of your reaction role message
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.ReactionRoles}.reactions`}
        render={() => (
          <FormItem className="space-y-4">
            <FormHeader>
              <FormLabel>Reactions</FormLabel>
              <FormDescription>
                The reactions you want members to be able to react with (max 20)
              </FormDescription>
            </FormHeader>
            <FormControl>
              <div className="space-y-4">
                {formFieldArray.fields.map(({ id }, index) => {
                  const baseName =
                    `${ModuleId.ReactionRoles}.reactions.${index}` as const

                  return (
                    <FormField
                      key={id}
                      control={form.control}
                      name={baseName}
                      render={() => (
                        <FormItem className="space-y-0">
                          <FormLabel className="sr-only">
                            Reaction {index + 1}
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <FormField
                                control={form.control}
                                name={`${baseName}.emoji`}
                                render={({ field }) => (
                                  <FormItem className="space-y-0">
                                    <FormLabel className="sr-only">
                                      Reaction Emoji
                                    </FormLabel>
                                    <FormControl>
                                      <EmojiPicker {...field} />
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
                                    <FormLabel className="sr-only">
                                      Reaction Role
                                    </FormLabel>
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
                                <Label className="sr-only">
                                  Delete Reaction
                                </Label>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                })}
                <Button
                  type="button"
                  variant="outline"
                  disabled={formFieldArray.fields.length >= 20}
                  onClick={() =>
                    formFieldArray.append({ emoji: "🌒", role: "" })
                  }
                >
                  Add Reaction
                </Button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </FormItem>
  )
}
