"use client"

import * as React from "react"

import { Controller, FormProvider, useFormContext } from "react-hook-form"

import { Label } from "@repo/ui/label"
import { Slot } from "@repo/ui/slot"

import { cn } from "~/lib/utils"

import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"

export const Form = FormProvider

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

export type FormItemContextValue = {
  id: string
}

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

export interface FormItemProps extends React.ComponentPropsWithRef<"div"> {}

export function FormItem({ className, ...props }: FormItemProps) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-1.5", className)} {...props} />
    </FormItemContext.Provider>
  )
}

export interface FormLabelProps
  extends React.ComponentPropsWithRef<typeof Label> {
  asChild?: boolean
}

export function FormLabel({ className, asChild, ...props }: FormLabelProps) {
  const { error, formItemId } = useFormField()

  const Comp = asChild ? (Slot as unknown as typeof Label) : Label

  return (
    <Comp
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

export interface FormHeaderProps extends React.ComponentPropsWithRef<"div"> {}

export function FormHeader({ className, ...props }: FormHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
  )
}

export interface FormControlProps
  extends React.ComponentPropsWithRef<typeof Slot> {}

export function FormControl({ ...props }: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

export interface FormDescriptionProps
  extends React.ComponentPropsWithoutRef<"p"> {
  asChild?: boolean
}

export function FormDescription({
  className,
  asChild,
  ...props
}: FormDescriptionProps) {
  const { formDescriptionId } = useFormField()

  const Component = asChild ? Slot : "p"

  return (
    <Component
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export interface FormMessageProps extends React.ComponentPropsWithRef<"p"> {}

export function FormMessage({
  className,
  children,
  ...props
}: FormMessageProps) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      id={formMessageId}
      className={cn("text-destructive text-sm font-medium", className)}
      {...props}
    >
      {body}
    </p>
  )
}
