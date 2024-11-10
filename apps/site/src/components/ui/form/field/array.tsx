import * as React from "react"

import { useFieldArray } from "react-hook-form"

import type {
  Control,
  FieldArrayPath,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form"

export const FormFieldArrayContext =
  React.createContext<UseFieldArrayReturn | null>(null)

export function useFormFieldArrayContext() {
  const fieldArrayContext = React.use(FormFieldArrayContext)

  if (!fieldArrayContext) {
    throw new Error("useFormFieldArray has to be used within <FormFieldArray>")
  }

  return fieldArrayContext
}

export interface FormFieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TFieldArrayName
  render: (
    props: UseFieldArrayReturn<TFieldValues, TFieldArrayName>,
  ) => React.ReactElement
}

export function FormFieldArray<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>({ render, ...rest }: FormFieldArrayProps<TFieldValues, TFieldArrayName>) {
  const fieldArray = useFieldArray(rest)

  return (
    <FormFieldArrayContext value={fieldArray as UseFieldArrayReturn}>
      {render(fieldArray)}
    </FormFieldArrayContext>
  )
}
