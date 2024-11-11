"use client"

import { AvatarIcon, FaceIcon, RadiobuttonIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { FormFieldArray } from "~/components/ui/form/field/array"
import { FormFieldArrayCard } from "~/components/ui/form/field/array-card"
import { FormFieldSelectItem } from "~/components/ui/form/field/select-item"
import { FormFieldSelectRole } from "~/components/ui/form/field/select-role"

import { getOrdinal } from "~/lib/utils"

import type { ModulesFormValues } from "~/types/dashboard"

const baseName = `${ModuleId.AutoRoles}.roles`

export const AutoRoles = () => {
  const form = useFormContext<ModulesFormValues>()

  return (
    <FormFieldArray
      label="Auto Roles"
      description="Auto Roles config"
      srOnlyLabelAndDescription={true}
      control={form.control}
      name={baseName}
      render={({ fields, append }) => (
        <div className="space-y-4">
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
                <FormFieldSelectItem
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
          <Button
            type="button"
            variant="outline"
            disabled={fields.length >= 10}
            onClick={() => append({ id: "", target: "everyone" })}
          >
            Add Role
          </Button>
        </div>
      )}
    />
  )
}
