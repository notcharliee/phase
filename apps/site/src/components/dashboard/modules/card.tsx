import { useCallback } from "react"

import { modules } from "@repo/config/phase/modules.ts"

import { Mode } from "~/components/dashboard/modules/mode-toggle"
import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "~/components/ui/credenza"
import {
  FormControl,
  FormDescription,
  FormField,
  FormHeader,
  FormItem,
  FormLabel,
} from "~/components/ui/form"
import { Switch } from "~/components/ui/switch"

import { cn } from "~/lib/utils"

import { defaultValues } from "~/app/dashboard/modules/_utils/client"

import type { ModuleId } from "@repo/config/phase/modules.ts"
import type { ModulesFormValues } from "~/types/dashboard"
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form"

export enum ModuleCardState {
  Undefined = 0,
  Clean = 1,
  Dirty = 2,
  Invalid = 3,
  Submitting = 4,
}

export interface ModuleCardProps {
  id: ModuleId
  mode: Mode
  state: ModuleCardState
  form: UseFormReturn<ModulesFormValues>
  children: React.ReactNode
}

export function ModuleCard({
  id,
  mode,
  state,
  form,
  children,
}: ModuleCardProps) {
  const { name, description, tags } = modules[id]

  const isEditMode = mode === Mode.Edit
  const isManageMode = mode === Mode.Manage
  const isUndefined = state === ModuleCardState.Undefined
  const isDirty = state === ModuleCardState.Dirty
  const isInvalid = state === ModuleCardState.Invalid
  const isDisabled = isEditMode && state === ModuleCardState.Submitting

  const handleCardClick = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      field: ControllerRenderProps<ModulesFormValues, ModuleId>,
    ) => {
      if (!isManageMode) return

      event.preventDefault()

      if (!field.value) {
        form.setValue(id, defaultValues[id], { shouldDirty: true })
      } else {
        form.setValue(id, undefined, { shouldDirty: true })
      }
    },
    [form, id, isManageMode],
  )

  if (isEditMode && isUndefined) return null

  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <Credenza>
          <CredenzaTrigger asChild>
            <Card
              role="button"
              tabIndex={0}
              aria-disabled={isDisabled}
              onClick={(event) => handleCardClick(event, field)}
              className={cn(
                "focus-visible:ring-ring group relative h-full cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-1 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                isDirty && "border-primary bg-primary/5",
                isInvalid && "border-destructive bg-destructive/5",
                isManageMode &&
                  isUndefined &&
                  "border-muted-foreground border-dashed opacity-50",
              )}
            >
              <CardHeader className="flex flex-col space-y-1.5">
                <CardTitle>{name}</CardTitle>
                <div className="inline-flex gap-0.5">
                  {tags.map((tag) => (
                    <Badge variant="secondary" key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                {isEditMode && (
                  <FormField
                    control={form.control}
                    name={`${id}.enabled`}
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="absolute right-6 top-6 !m-0">
                        <FormHeader className="sr-only">
                          <FormLabel>Enabled</FormLabel>
                          <FormDescription>
                            Whether or not the module is enabled
                          </FormDescription>
                        </FormHeader>
                        <FormControl>
                          <Switch
                            {...field}
                            disabled={isDisabled}
                            checked={value}
                            defaultChecked={value}
                            className="absolute right-0 top-0 !m-0"
                            onCheckedChange={onChange}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          </CredenzaTrigger>
          <CredenzaContent className="max-h-[90%] overflow-auto lg:max-h-[80%]">
            <FormItem className="md:space-y-8">
              <CredenzaHeader>
                <FormLabel asChild>
                  <CredenzaTitle>{name}</CredenzaTitle>
                </FormLabel>
                <FormDescription asChild>
                  <CredenzaDescription>{description}</CredenzaDescription>
                </FormDescription>
              </CredenzaHeader>
              <FormControl>
                <CredenzaBody>{children}</CredenzaBody>
              </FormControl>
            </FormItem>
          </CredenzaContent>
        </Credenza>
      )}
    />
  )
}
