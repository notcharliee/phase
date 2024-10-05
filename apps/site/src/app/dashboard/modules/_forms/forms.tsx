"use client"

import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/utils/modules"
import { useFieldArray, useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { SelectChannel } from "~/components/dashboard/select/channel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"

import { cn } from "~/lib/utils"

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

                  const formName =
                    formFields.forms[index]?.name ?? `Form ${index + 1}`

                  return (
                    <Card key={field.id}>
                      <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                        <CardTitle>{formName}</CardTitle>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => formFieldArray.remove(index)}
                        >
                          <Label className="sr-only">Delete Form</Label>
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
                                <Input
                                  {...field}
                                  placeholder={`Form ${index + 1}`}
                                />
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
                                The channel to create form threads in
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
  const formFields = form.watch()[ModuleId.Forms]!
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${baseName}.questions`,
  })

  return (
    <div className="space-y-4">
      <FormHeader>
        <FormLabel>Questions</FormLabel>
        <FormDescription>
          The questions to ask the members to fill out
        </FormDescription>
      </FormHeader>
      <Accordion
        type="single"
        className={cn(!formFieldArray.fields.length && "hidden", "!my-2")}
        collapsible
      >
        {formFieldArray.fields.map((field, index) => {
          const nestedBaseName = `${baseName}.questions.${index}` as const

          const questionLabel =
            formFields.forms[index]?.questions[index]?.label ??
            `Question ${index + 1}`

          return (
            <AccordionItem value={field.id} key={field.id}>
              <AccordionTrigger className="group py-2">
                <div className="flex w-full items-center justify-between">
                  <Label className="cursor-pointer">{questionLabel}</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(event) => event.stopPropagation()}
                        asChild
                      >
                        <div>
                          <Label className="sr-only">Options</Label>
                          <DotsHorizontalIcon className="h-4 w-4" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        disabled={index === 0}
                        onClick={() => formFieldArray.move(index, index - 1)}
                      >
                        Move up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={index === formFieldArray.fields.length - 1}
                        onClick={() => formFieldArray.move(index, index + 1)}
                      >
                        Move down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => formFieldArray.remove(index)}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-8 pb-6">
                <FormField
                  control={form.control}
                  name={`${nestedBaseName}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Example: Are you super cool?"
                        />
                      </FormControl>
                      <FormDescription>The question to ask</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${nestedBaseName}.required`}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem className="space-y-4">
                      <FormHeader>
                        <FormLabel>Required</FormLabel>
                        <FormDescription>
                          Whether or not an answer is required
                        </FormDescription>
                      </FormHeader>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Switch
                            {...field}
                            checked={value}
                            onCheckedChange={onChange}
                          />
                          <Label className="font-medium">
                            {value
                              ? "Yes, an answer is required"
                              : "No, this question is optional"}
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${nestedBaseName}.type`}
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Response Type</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        The type of response to expect
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      <Button
        type="button"
        variant="outline"
        disabled={formFieldArray.fields.length >= 25}
        onClick={() =>
          formFieldArray.append({
            label: undefined,
            type: "string",
            required: true,
          })
        }
      >
        Add question
      </Button>
    </div>
  )
}
