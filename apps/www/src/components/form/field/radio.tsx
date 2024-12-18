import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/form"

import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldRadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description: string
  disabled?: boolean
  items: {
    label: string
    value: string
  }[]
}

export function FormFieldRadio<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldRadioProps<TFieldValues, TName>) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field: { onChange, ...field } }) => (
        <FormItem className="space-y-4">
          <div>
            <FormLabel>{props.label}</FormLabel>
            <FormDescription>{props.description}</FormDescription>
            <FormMessage />
          </div>
          <FormControl>
            <RadioGroup onValueChange={onChange} {...field}>
              {props.items.map((item) => (
                <FormItem
                  key={item.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={item.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{item.label}</FormLabel>
                  <FormDescription className="sr-only">
                    {item.label}
                  </FormDescription>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
