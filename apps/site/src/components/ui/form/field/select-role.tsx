import { SelectRole } from "~/components/dashboard/select/role"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldSelectRoleProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description: string
  placeholder?: string
  multiselect?: boolean
  disabled?: boolean
}

export function FormFieldSelectRole<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldSelectRoleProps<TFieldValues, TName>) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <SelectRole multiselect={props.multiselect} {...field} />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
