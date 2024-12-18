"use client"

import * as React from "react"

import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { useFormFieldArrayContext } from "~/components/form/field/array"

interface FormFieldArrayAppendSelectItem {
  label: string
  description?: string
  value: string
  appendValue: object | (() => object)
}

export interface FormFieldArrayAppendSelectProps
  extends React.ComponentPropsWithRef<typeof Button> {
  label: string
  description?: string
  items: FormFieldArrayAppendSelectItem[]
}

export function FormFieldArrayAppendSelect({
  disabled,
  children,
  label,
  description,
  ...props
}: FormFieldArrayAppendSelectProps) {
  const [open, setOpen] = React.useState(false)

  const { maxLength, fields, append } = useFormFieldArrayContext()
  const isDisabled = disabled ?? !!(maxLength && fields.length >= maxLength)

  const onItemClick = (item: FormFieldArrayAppendSelectItem) => {
    append(
      item.appendValue instanceof Function
        ? item.appendValue()
        : item.appendValue,
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={isDisabled}
          aria-label={label}
          aria-description={description}
          {...props}
        >
          {children ?? label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {props.items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => onItemClick(item)}
            aria-label={item.label}
            aria-description={item.description}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
