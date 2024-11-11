import { SelectMention } from "~/components/dashboard/select/mention"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldSelectMentionProps<
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

export function FormFieldSelectMention<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldSelectMentionProps<TFieldValues, TName>) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <SelectMention multiselect={props.multiselect} {...field} />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
