"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 as randomUUID } from "uuid"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateForms } from "~/app/dashboard/_actions/updateModule"
import { formsSchema } from "~/validators/modules"

import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"

type FormValues = z.infer<typeof formsSchema>

export const Forms = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(formsSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.Forms]
      ? {
          ...dashboard.guild.modules[ModuleId.Forms],
          forms: dashboard.guild.modules[ModuleId.Forms].forms.map((form) => ({
            ...form,
            questions: form.questions.map((question) => ({ question })),
          })),
        }
      : {
          enabled: false,
          channel: "",
          forms: [
            {
              id: randomUUID(),
              name: "Form 1",
              channel: "",
              questions: [],
            },
          ],
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const formFields = form.watch()

  const fieldArray = useFieldArray({
    control: form.control,
    name: "forms",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateForms(data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules[ModuleId.Forms] = updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
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
          name={`forms`}
          render={() => (
            <FormItem className="space-y-4">
              {fieldArray.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                    <CardTitle>{formFields.forms[index]?.name}</CardTitle>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => fieldArray.remove(index)}
                    >
                      <Label className="sr-only">Delete Counter</Label>
                      <TrashIcon className="h-4 w-4" />
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
                            <SelectChannel {...field} />
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
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}

const FormQuestions = (props: {
  form: UseFormReturn<FormValues>
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
                      <Input
                        placeholder="Example: Are you super cool?"
                        {...field}
                      />
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
