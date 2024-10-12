"use client"

import * as React from "react"

import { cn } from "~/lib/utils"

type InputValue<TType extends React.HTMLInputTypeAttribute> =
  TType extends "number" ? number : string

export interface InputProps<TType extends React.HTMLInputTypeAttribute>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  type?: TType
  onChange?: (value: InputValue<TType> | null) => void
}

export const Input = React.forwardRef<
  HTMLInputElement,
  InputProps<React.HTMLInputTypeAttribute>
>(({ className, type = "text", onChange, ...props }, ref) => {
  const onChangeFn = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return

    let value: string | number | null = event.target.value

    if (type === "number") {
      value = parseInt(event.target.value, 10)
      if (isNaN(value)) value = null
    }

    if (!value || value === "") {
      value = null
    }

    onChange(value)
  }

  return (
    <input
      ref={ref}
      type={type}
      onChange={onChangeFn}
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full truncate rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}) as unknown as <TType extends React.HTMLInputTypeAttribute = "text">(
  props: InputProps<TType> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement<InputProps<TType>>
