"use client"

import { AvatarIcon, FaceIcon, RadiobuttonIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldArray } from "~/components/ui/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/ui/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/ui/form/field/array-card"
import { FormFieldSelect } from "~/components/ui/form/field/select"
import { FormFieldSelectRole } from "~/components/ui/form/field/select-role"
import { FormFieldWrapper } from "~/components/ui/form/field/wrapper"

import { getOrdinal } from "~/lib/utils"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.AutoRoles}.roles`

export const AutoRoles = () => {
  const form = useFormContext<ModulesFormValuesInput>()

  return (
    <FormFieldArray
      label="Auto Roles"
      description="Auto Roles config"
      srOnlyLabelAndDescription={true}
      maxLength={10}
      control={form.control}
      name={baseName}
      render={({ fields }) => (
        <FormFieldWrapper type={"array"}>
          {fields.map((field, index) => {
            const cardLabel = `Auto Role ${index + 1}`
            const cardDescription = `The ${getOrdinal(index + 1)} role to assign to new members`

            return (
              <FormFieldArrayCard
                key={field.id}
                index={index}
                label={cardLabel}
                description={cardDescription}
                control={form.control}
                name={`${baseName}.${index}`}
              >
                <FormFieldSelectRole
                  label="Role"
                  description="The role to assign"
                  control={form.control}
                  name={`${baseName}.${index}.id`}
                />
                <FormFieldSelect
                  label="Target"
                  description="The target user type"
                  placeholder="Select a target"
                  control={form.control}
                  name={`${baseName}.${index}.target`}
                  items={[
                    { label: "Everyone", value: "everyone", icon: FaceIcon },
                    { label: "Members", value: "members", icon: AvatarIcon },
                    { label: "Bots", value: "bots", icon: RadiobuttonIcon },
                  ]}
                />
              </FormFieldArrayCard>
            )
          })}
          <FormFieldArrayAppendButton
            label="Add Role"
            description="Add a new auto role"
            appendValue={{ id: "", target: "everyone" }}
          />
        </FormFieldWrapper>
      )}
    />
  )
}
