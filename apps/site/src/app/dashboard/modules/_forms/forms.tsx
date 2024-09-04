"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { SelectChannel } from "~/components/dashboard/select-channel"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
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

export const Forms = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFields = form.watch()[ModuleId.Forms]!
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.Forms}.forms`,
  })

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.Forms}.channel`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Channel</FormLabel>
            <FormControl>
              <SelectChannel {...field} />
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
        name={`${ModuleId.Forms}.forms`}
        render={() => (
          <FormItem className="space-y-4">
            <FormHeader>
              <FormLabel>Forms</FormLabel>
              <FormDescription>
                The forms you want members to be able to create (max 10)
              </FormDescription>
            </FormHeader>
            <FormControl>
              <div className="space-y-4">
                {formFieldArray.fields.map((field, index) => {
                  const baseName = `${ModuleId.Forms}.forms.${index}` as const

                  return (
                    <Card key={field.id}>
                      <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                        <CardTitle>{formFields.forms[index]?.name}</CardTitle>
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
                          name={`${baseName}.name`}
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
                          name={`${baseName}.channel`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Channel</FormLabel>
                              <FormControl>
                                <SelectChannel {...field} />
                              </FormControl>
                              <FormDescription>
                                Where to send the create form message
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormQuestions index={index} />
                      </CardContent>
                    </Card>
                  )
                })}
                <Button
                  type="button"
                  variant="outline"
                  disabled={formFieldArray.fields.length >= 10}
                  onClick={() =>
                    formFieldArray.append({
                      id: randomUUID(),
                      name: `Form ${formFieldArray.fields.length + 1}`,
                      channel: "",
                      questions: [],
                    })
                  }
                >
                  Add Form
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormItem>
  )
}

interface FormQuestionsProps {
  index: number
}

const FormQuestions = (props: FormQuestionsProps) => {
  const baseName = `${ModuleId.Forms}.forms.${props.index}` as const

  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formQuestionsFieldArray = useFieldArray({
    control: form.control,
    name: `${baseName}.questions`,
  })

  return (
    <FormField
      control={form.control}
      name={`${baseName}.questions`}
      render={() => (
        <FormItem className="space-y-4">
          {formQuestionsFieldArray.fields.map((field, index) => {
            const nestedBaseName = `${baseName}.questions.${index}` as const

            return (
              <FormField
                key={field.id}
                control={form.control}
                name={`${nestedBaseName}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question {index + 1}</FormLabel>
                    <FormControl>
                      <div className="flex gap-3">
                        <Input
                          {...field}
                          placeholder="Example: Are you super cool?"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => formQuestionsFieldArray.remove(index)}
                        >
                          <Label className="sr-only">Delete Form</Label>
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
            disabled={formQuestionsFieldArray.fields.length >= 25}
            onClick={() =>
              formQuestionsFieldArray.append({
                label: "",
                type: "string",
                required: true,
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
