"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useFormContext } from "react-hook-form"

import { SelectChannel } from "~/components/dashboard/select-channel"
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
import { Link } from "~/components/ui/link"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const Counters = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFields = form.watch()[ModuleId.Counters]!
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.Counters}.counters`,
  })

  return (
    <FormItem className="space-y-8">
      <div className="text-muted-foreground space-y-4 text-sm">
        <p>
          Counter channels are updated once every 10 minutes, so it might take a
          few moments for the changes to show up in your server.
        </p>
        <p>
          Before you start, make sure to read the{" "}
          <Link href={"/docs/modules/counters"}>documentation page</Link> for
          this module so you know what variables you can use.
        </p>
      </div>
      <FormField
        control={form.control}
        name={`${ModuleId.Counters}.counters`}
        render={() => (
          <FormItem className="space-y-4">
            {formFieldArray.fields.map((field, index) => {
              const baseName = `${ModuleId.Counters}.counters.${index}` as const

              return (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                    <CardTitle>{formFields.counters[index]?.name}</CardTitle>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => formFieldArray.remove(index)}
                    >
                      <Label className="sr-only">Delete Counter</Label>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 border-t pt-6">
                    <FormField
                      control={form.control}
                      name={`${baseName}.channel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel</FormLabel>
                          <FormControl>
                            <SelectChannel
                              channelType="GuildVoice"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The channel to count members in.
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
                            <Input
                              placeholder="Example: {memberCount} Members"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The content of the counter.
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
              onClick={() =>
                formFieldArray.append({
                  name: `Counter ${formFields.counters.length + 1}`,
                  channel: "",
                  content: "",
                })
              }
            >
              Add Counter
            </Button>
          </FormItem>
        )}
      />
    </FormItem>
  )
}
