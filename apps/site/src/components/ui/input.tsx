import * as React from "react"

import { cn } from "@/lib/utils"

type ConditionalUndefined<TEmpty extends boolean, U> = TEmpty extends true
  ? U | undefined
  : U

type InputValue<
  TType extends React.HTMLInputTypeAttribute,
  TEmpty extends boolean,
> = TType extends "number"
  ? ConditionalUndefined<TEmpty, number>
  : ConditionalUndefined<TEmpty, string>

export interface InputProps<
  TType extends React.HTMLInputTypeAttribute,
  TEmpty extends boolean,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  type?: TType
  treatEmptyAsUndefined?: TEmpty
  onChange?: (value: InputValue<TType, TEmpty>) => void
}

export const Input = React.forwardRef<
  HTMLInputElement,
  InputProps<React.HTMLInputTypeAttribute, boolean>
>(
  (
    {
      className,
      type = "text",
      treatEmptyAsUndefined = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const onChangeFn = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return

      let value: string | number | undefined = event.target.value

      if (type === "number") {
        value = parseInt(event.target.value, 10)
        if (isNaN(value)) value = undefined
      }

      if (treatEmptyAsUndefined && (!value || value === "")) {
        value = undefined
      }

      onChange(value as InputValue<typeof type, typeof treatEmptyAsUndefined>)
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
  },
) as unknown as <
  TType extends React.HTMLInputTypeAttribute = "text",
  TEmpty extends boolean = false,
>(
  props: InputProps<TType, TEmpty> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement<InputProps<TType, TEmpty>>
