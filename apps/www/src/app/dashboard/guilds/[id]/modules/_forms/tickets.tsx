"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldRichTextarea } from "~/components/form/field/rich-textarea"
import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldSelectRole } from "~/components/form/field/select-role"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = ModuleId.Tickets

export const Tickets = () => {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch(baseName)!

  return (
    <FormFieldWrapper>
      <FormFieldSelectChannel
        label="Channel"
        description="The channel to create ticket threads from"
        control={form.control}
        name={`${baseName}.channel`}
      />
      <FormFieldRichTextarea
        label="Message"
        description="The content of the ticket panel"
        placeholder="Example: Press the button below to open a ticket."
        control={form.control}
        name={`${baseName}.message`}
      />
      <FormFieldInput
        label="Max Open"
        description="The maximum number of open tickets allowed per user"
        placeholder="Example: 5"
        type="number"
        control={form.control}
        name={`${baseName}.max_open`}
      />
      <FormFieldArray
        label="Tickets"
        description="The tickets you want members to be able to create"
        maxLength={5}
        control={form.control}
        name={`${baseName}.tickets`}
        render={({ fields }) => (
          <FormFieldWrapper type={"array"}>
            {fields.map((field, index) => {
              const ticketBaseName = `${baseName}.tickets.${index}` as const

              const nameField = formFields.tickets[index]?.name
              const cardTitle = nameField?.length
                ? nameField
                : `Ticket ${index + 1}`

              return (
                <FormFieldArrayCard
                  key={field.id}
                  index={index}
                  label={cardTitle}
                  control={form.control}
                  name={ticketBaseName}
                >
                  <FormFieldInput
                    label="Name"
                    description="The name of the ticket"
                    placeholder="Example: Support"
                    control={form.control}
                    name={`${ticketBaseName}.name`}
                  />
                  <FormFieldRichTextarea
                    label="Message"
                    description="The message to send in the ticket"
                    placeholder="Example: Staff will be with you shortly."
                    control={form.control}
                    name={`${ticketBaseName}.message`}
                  />
                  <FormFieldSelectRole
                    label="Mention"
                    description="Who to ping when a ticket is created"
                    control={form.control}
                    name={`${ticketBaseName}.mention`}
                  />
                </FormFieldArrayCard>
              )
            })}
            <FormFieldArrayAppendButton
              label="Add Ticket"
              description="Add a new ticket"
              appendValue={() => ({
                id: randomUUID(),
                name: "",
                message: "",
              })}
            />
          </FormFieldWrapper>
        )}
      />
    </FormFieldWrapper>
  )
}
