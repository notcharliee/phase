import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Switch } from "~/components/ui/switch"

import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description: string
}

export function FormFieldSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldSwitchProps<TFieldValues, TName>) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="flex items-center justify-between space-y-0">
          <div className="space-y-1.5">
            <FormLabel>{props.label}</FormLabel>
            <FormDescription>{props.description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={value} onCheckedChange={onChange} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
