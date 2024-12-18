"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldSelectRole } from "~/components/form/field/select-role"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = ModuleId.Warnings

export const Warnings = () => {
  const form = useFormContext<ModulesFormValuesInput>()

  return (
    <FormFieldArray
      label="Warnings"
      description="The warnings that can be given to members"
      srOnlyLabelAndDescription={true}
      maxLength={10}
      control={form.control}
      name={`${baseName}.warnings`}
      render={({ fields }) => (
        <FormFieldWrapper type={"array"}>
          {fields.map((field, index) => {
            const warningBaseName = `${baseName}.warnings.${index}` as const

            const cardTitle = `Warning ${index + 1}`

            return (
              <FormFieldArrayCard
                key={field.id}
                index={index}
                label={cardTitle}
                control={form.control}
                name={warningBaseName}
              >
                <FormFieldSelectRole
                  label="Role"
                  description="The role to assign for this warning"
                  control={form.control}
                  name={`${warningBaseName}.role`}
                />
              </FormFieldArrayCard>
            )
          })}
          <FormFieldArrayAppendButton
            label="Add Warning"
            description="Add a new warning"
            appendValue={{ role: "" }}
          />
        </FormFieldWrapper>
      )}
    />
  )
}
