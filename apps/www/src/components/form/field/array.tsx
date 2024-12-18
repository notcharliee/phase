"use client"

import * as React from "react"

import { useFieldArray } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/form"

import { cn } from "~/lib/utils"

import type {
  Control,
  FieldArrayPath,
  FieldPath,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form"

export type FormFieldArrayContextValue = UseFieldArrayReturn & {
  maxLength?: number
}

export const FormFieldArrayContext =
  React.createContext<FormFieldArrayContextValue | null>(null)

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
  label: string
  description: string
  disabled?: boolean
  maxLength?: number
  srOnlyLabelAndDescription?: boolean
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
>(props: FormFieldArrayProps<TFieldValues, TFieldArrayName>) {
  const fieldArray = useFieldArray(props)

  const contextValue = {
    ...fieldArray,
    maxLength: props.maxLength,
  } as FormFieldArrayContextValue

  return (
    <FormFieldArrayContext value={contextValue}>
      <FormField
        control={props.control}
        name={props.name as FieldPath<TFieldValues>}
        disabled={props.disabled}
        render={() => (
          <FormItem className="space-y-4">
            <div>
              <FormLabel
                className={cn(props.srOnlyLabelAndDescription && "sr-only")}
              >
                {props.label}
              </FormLabel>
              <FormDescription
                className={cn(props.srOnlyLabelAndDescription && "sr-only")}
              >
                {props.description}
              </FormDescription>
            </div>
            <FormMessage />
            <FormControl>{props.render(fieldArray)}</FormControl>
          </FormItem>
        )}
      />
    </FormFieldArrayContext>
  )
}
