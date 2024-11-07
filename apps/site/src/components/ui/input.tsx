"use client"

import * as React from "react"

import { cn } from "~/lib/utils"

type InputType = React.HTMLInputTypeAttribute

type InputValue<TType extends InputType = InputType> = TType extends "number"
  ? number
  : string

export interface InputProps<TType extends InputType = InputType>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  type?: TType
  onChange?: (value: InputValue<TType> | null) => void
}

export function Input<TType extends InputType = "text">({
  type = "text" as TType,
  className,
  onChange,
  ...props
}: InputProps<TType>) {
  const onChangeFn = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return

      let value: InputValue<TType> | null = event.target
        .value as InputValue<TType>

      if (type === "number") {
        const numericValue = Number(event.target.value)
        value = isNaN(numericValue) ? null : (numericValue as InputValue<TType>)
      }

      if (value === "" || value === undefined) {
        value = null
      }

      onChange(value)
    },
    [onChange, type],
  )

  return (
    <input
      type={type}
      onChange={onChangeFn}
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full truncate rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
