"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useFormContext } from "react-hook-form"

import { SelectRole } from "~/components/dashboard/select-role"
import { Button } from "~/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Label } from "~/components/ui/label"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const Warnings = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.Warnings}.warnings`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.Warnings}.warnings`}
        render={() => (
          <FormItem className="space-y-4">
            {formFieldArray.fields.map((field, index) => {
              const baseName = `${ModuleId.Warnings}.warnings.${index}` as const

              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`${baseName}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warning {index + 1}</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          <SelectRole {...field} />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => formFieldArray.remove(index)}
                          >
                            <Label className="sr-only">Delete Warning</Label>
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
              disabled={formFieldArray.fields.length >= 10}
              onClick={() => formFieldArray.append({ role: "" })}
            >
              Add Warning
            </Button>
          </FormItem>
        )}
      />
    </FormItem>
  )
}
