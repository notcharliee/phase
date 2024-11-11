"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { Button } from "~/components/ui/button"
import { FormFieldArray } from "~/components/ui/form/field/array"
import { FormFieldArrayCard } from "~/components/ui/form/field/array-card"
import { FormFieldInput } from "~/components/ui/form/field/input"
import { FormFieldSelectChannel } from "~/components/ui/form/field/select-channel"
import { FormFieldSelectItem } from "~/components/ui/form/field/select-item"
import { FormFieldSwitch } from "~/components/ui/form/field/switch"

import type { ModulesFormValues } from "~/types/dashboard"

const baseName = `${ModuleId.Forms}.forms`

export const Forms = () => {
  const form = useFormContext<ModulesFormValues>()
  const formFields = form.watch()[ModuleId.Forms]!

  return (
    <div className="space-y-6">
      <FormFieldSelectChannel
        label="Channel"
        description="Where to send submitted form responses"
        control={form.control}
        name={`${ModuleId.Forms}.channel`}
      />
      <FormFieldArray
        label="Forms"
        description="The forms you want members to be able to create"
        control={form.control}
        name={baseName}
        render={({ fields, append }) => (
          <div className="space-y-4">
            {fields.map((field, index) => {
              const nameField = formFields.forms[index]?.name
              const cardTitle = nameField?.length
                ? nameField
                : `Form ${index + 1}`

              return (
                <FormFieldArrayCard
                  key={field.id}
                  index={index}
                  label={cardTitle}
                  control={form.control}
                  name={`${baseName}.${index}`}
                >
                  <FormFieldInput
                    label="Name"
                    description="The name of the form"
                    placeholder="Example: Staff Application"
                    control={form.control}
                    name={`${baseName}.${index}.name`}
                  />
                  <FormFieldSelectChannel
                    label="Channel"
                    description="Where to send the form"
                    control={form.control}
                    name={`${baseName}.${index}.channel`}
                  />
                  <FormFieldArray
                    label="Questions"
                    description="The questions to ask the members to fill out"
                    control={form.control}
                    name={`${baseName}.${index}.questions`}
                    render={({ fields, append }) => (
                      <div className="space-y-4">
                        {fields.map((field, index) => {
                          const labelField =
                            formFields.forms[index]?.questions[index]?.label
                          const cardTitle = labelField?.length
                            ? labelField
                            : `Question ${index + 1}`

                          return (
                            <FormFieldArrayCard
                              key={field.id}
                              index={index}
                              label={cardTitle}
                              control={form.control}
                              name={`${baseName}.${index}.questions.${index}`}
                            >
                              <FormFieldInput
                                label="Label"
                                description="What to call the question"
                                placeholder="Example: What is your name?"
                                control={form.control}
                                name={`${baseName}.${index}.questions.${index}.label`}
                              />
                              <FormFieldSelectItem
                                label="Type"
                                description="What type of response to expect"
                                placeholder="Select a response type"
                                control={form.control}
                                name={`${baseName}.${index}.questions.${index}.type`}
                                items={[
                                  { label: "Text", value: "string" },
                                  { label: "Number", value: "number" },
                                  { label: "Yes/No", value: "boolean" },
                                ]}
                              />
                              <FormFieldSwitch
                                label="Required"
                                description="Whether or not this question is required"
                                control={form.control}
                                name={`${baseName}.${index}.questions.${index}.required`}
                              />
                            </FormFieldArrayCard>
                          )
                        })}
                        <Button
                          type="button"
                          variant="outline"
                          disabled={fields.length >= 25}
                          onClick={() =>
                            append({
                              label: undefined,
                              type: "string",
                              required: true,
                            })
                          }
                        >
                          Add Question
                        </Button>
                      </div>
                    )}
                  />
                </FormFieldArrayCard>
              )
            })}
            <Button
              type="button"
              variant="outline"
              disabled={fields.length >= 10}
              onClick={() =>
                append({
                  id: randomUUID(),
                  name: undefined,
                  channel: "",
                  questions: [],
                })
              }
            >
              Add Form
            </Button>
          </div>
        )}
      />
    </div>
  )
}
