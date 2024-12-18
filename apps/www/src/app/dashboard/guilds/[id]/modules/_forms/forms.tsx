"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldSelect } from "~/components/form/field/select"
import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldSwitch } from "~/components/form/field/switch"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.Forms}.forms`

export const Forms = () => {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch()[ModuleId.Forms]!

  return (
    <FormFieldWrapper>
      <FormFieldSelectChannel
        label="Channel"
        description="Where to send submitted form responses"
        control={form.control}
        name={`${ModuleId.Forms}.channel`}
      />
      <FormFieldArray
        label="Forms"
        description="The forms you want members to be able to create"
        maxLength={10}
        control={form.control}
        name={baseName}
        render={({ fields }) => (
          <FormFieldWrapper type={"array"}>
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
                    maxLength={25}
                    control={form.control}
                    name={`${baseName}.${index}.questions`}
                    render={({ fields }) => (
                      <FormFieldWrapper type={"array"}>
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
                              <FormFieldSelect
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
                        <FormFieldArrayAppendButton
                          label="Add Question"
                          description="Add a new question"
                          appendValue={{
                            label: undefined,
                            type: "string",
                            required: true,
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </FormFieldArrayCard>
              )
            })}
            <FormFieldArrayAppendButton
              label="Add Form"
              description="Add a new form"
              appendValue={() => ({
                id: randomUUID(),
                name: undefined,
                channel: "",
                questions: [],
              })}
            />
          </FormFieldWrapper>
        )}
      />
    </FormFieldWrapper>
  )
}
