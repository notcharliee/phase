import { SelectChannel } from "~/components/dashboard/select/channel"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/form"

import type { AllowedChannelTypes } from "~/components/channel-icons"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldSelectChannelProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description: string
  placeholder?: string
  channelType?: keyof typeof AllowedChannelTypes
  multiselect?: boolean
  disabled?: boolean
}

export function FormFieldSelectChannel<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldSelectChannelProps<TFieldValues, TName>) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <SelectChannel
              channelType={props.channelType}
              multiselect={props.multiselect}
              onValueChange={onChange}
              {...field}
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
