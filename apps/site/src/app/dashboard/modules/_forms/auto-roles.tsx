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
  FormMessage,
} from "~/components/ui/form"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const AutoRoles = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.AutoRoles}.roles`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.AutoRoles}.roles`}
        render={() => (
          <FormItem className="space-y-4">
            {formFieldArray.fields.map((field, index) => {
              const baseName = `${ModuleId.AutoRoles}.roles.${index}` as const

              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`${baseName}.id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-3">
                          <SelectRole {...field} />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => formFieldArray.remove(index)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="mb-2" />
                    </FormItem>
                  )}
                />
              )
            })}
            <Button
              type="button"
              variant="outline"
              disabled={formFieldArray.fields.length >= 10}
              onClick={() => formFieldArray.append({ id: "" })}
            >
              Add Role
            </Button>
          </FormItem>
        )}
      />
    </FormItem>
  )
}
