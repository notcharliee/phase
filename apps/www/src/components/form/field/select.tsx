import * as React from "react"

import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { LucideIcon } from "@repo/ui/lucide-icon"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/form"

import type { LucideIconName } from "@repo/ui/lucide-icon"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description: string
  placeholder?: string
  disabled?: boolean
  items: {
    label: string
    value: string
    iconName?: LucideIconName
  }[]
}

export function FormFieldSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldSelectProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => {
        const currentItem = field.value
          ? props.items.find((item) => item.value === field.value)
          : undefined

        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-between gap-2 px-3 py-1.5 font-normal"
                  >
                    <span className="flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                      {currentItem?.iconName && (
                        <LucideIcon name={currentItem.iconName} />
                      )}
                      {currentItem?.label ??
                        props.placeholder ??
                        "Select an item"}
                    </span>
                    <LucideIcon
                      name="chevrons-up-down"
                      className="opacity-50"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  {props.items.map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => field.onChange(item.value)}
                      className="flex items-center"
                    >
                      {item.iconName && <LucideIcon name={item.iconName} />}
                      {item.label}
                      {item.value === currentItem?.value && (
                        <LucideIcon
                          name="check"
                          className="absolute right-2 size-3.5"
                        />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </FormControl>
            <FormDescription>{props.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
