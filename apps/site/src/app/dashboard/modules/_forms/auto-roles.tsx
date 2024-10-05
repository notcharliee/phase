"use client"

import {
  AvatarIcon,
  DotsVerticalIcon,
  FaceIcon,
  RadiobuttonIcon,
} from "@radix-ui/react-icons"
import { ModuleId } from "@repo/utils/modules"
import { useFieldArray, useFormContext } from "react-hook-form"

import { SelectRole } from "~/components/dashboard/select/role"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import { getOrdinal } from "~/lib/utils"

import type { ModulesFormValues } from "~/types/dashboard"
import type { modulesSchema } from "~/validators/modules"
import type {
  ControllerRenderProps,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form"
import type { z } from "zod"

export const AutoRoles = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.AutoRoles}.roles`,
  })

  return (
    <div className="space-y-4">
      {formFieldArray.fields.map((field, index) => {
        const baseName = `${ModuleId.AutoRoles}.roles.${index}` as const

        return (
          <FormField
            key={field.id}
            control={form.control}
            name={baseName}
            render={() => (
              <FormItem className="flex flex-col gap-2 space-y-0">
                <FormLabel className="sr-only">
                  {`Auto Role ${index + 1}`}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2.5">
                    <FormField
                      control={form.control}
                      name={`${baseName}.id`}
                      render={({ field }) => <SelectRole {...field} />}
                    />
                    <FormField
                      control={form.control}
                      name={`${baseName}.target`}
                      render={({ field }) => <SelectTarget {...field} />}
                    />
                    <AutoRoleOptions
                      form={form}
                      formFieldArray={formFieldArray}
                      index={index}
                    />
                  </div>
                </FormControl>
                <FormDescription className="sr-only">
                  {`The ${getOrdinal(index + 1)} role to assign to new members`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      })}
      <Button
        type="button"
        variant="outline"
        disabled={formFieldArray.fields.length >= 10}
        onClick={() => formFieldArray.append({ id: "", target: "everyone" })}
      >
        Add Role
      </Button>
    </div>
  )
}

function SelectTarget({
  onChange,
  value,
  ...props
}: Omit<ControllerRenderProps, "ref">) {
  const EveryoneIcon = FaceIcon
  const MembersIcon = AvatarIcon
  const BotsIcon = RadiobuttonIcon

  const icons = {
    everyone: EveryoneIcon,
    members: MembersIcon,
    bots: BotsIcon,
  }

  const Icon = icons[value as keyof typeof icons]

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <Icon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={value === "everyone"}
          onClick={(event) => {
            event.preventDefault()
            onChange("everyone")
          }}
        >
          Everyone
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={value === "members"}
          onClick={(event) => {
            event.preventDefault()
            onChange("members")
          }}
        >
          Members
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={value === "bots"}
          onClick={(event) => {
            event.preventDefault()
            onChange("bots")
          }}
        >
          Bots
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface AutoRoleOptionsProps {
  form: UseFormReturn<ModulesFormValues>
  formFieldArray: UseFieldArrayReturn<ModulesFormValues>
  index: number
}

function AutoRoleOptions({
  form,
  formFieldArray: { move, remove },
  index,
}: AutoRoleOptionsProps) {
  const formValues = form.watch()[ModuleId.AutoRoles]!

  const isFirst = index === 0
  const isLast = index === formValues.roles.length - 1

  const updateIndex = (i: number) => move(index, i)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <DotsVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={isFirst}
          onClick={() => updateIndex(index - 1)}
        >
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isLast}
          onClick={() => updateIndex(index + 1)}
        >
          Move down
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => remove(index)}>
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
