import {
  CaretDownIcon,
  CaretUpIcon,
  CopyIcon,
  MoveIcon,
  TrashIcon,
} from "@radix-ui/react-icons"

import { Button } from "~/components/ui/button"
import { ButtonGroup } from "~/components/ui/button-group"
import { Card, CardContent, CardTitle } from "~/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form"
import { useFormFieldArrayContext } from "~/components/ui/form/field/array"

import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldArrayCardProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  index: number
  label: string
  description?: string
  children: React.ReactNode
}

export function FormFieldArrayCard<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldArrayCardProps<TFieldValues, TName>) {
  const { fields, append, remove, move } = useFormFieldArrayContext()

  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="space-y-0">
          <Card>
            <div className="flex items-center justify-between gap-2 px-6 py-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <FormLabel asChild>
                  <CardTitle className="truncate">{props.label}</CardTitle>
                </FormLabel>
                <FormDescription className="sr-only">
                  {props.description ?? props.label}
                </FormDescription>
              </div>
              <ButtonGroup>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant={"outline"} aria-label="Move">
                      <MoveIcon className="pointer-events-none size-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      disabled={props.index === 0}
                      onClick={() => move(props.index, props.index - 1)}
                    >
                      <CaretUpIcon className="h-4 w-4" />
                      Move up
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={props.index === fields.length - 1}
                      onClick={() => move(props.index, props.index + 1)}
                    >
                      <CaretDownIcon className="h-4 w-4" />
                      Move down
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  aria-label="Duplicate"
                  onClick={() => append(field.value, { shouldFocus: true })}
                >
                  <CopyIcon className="pointer-events-none size-4 shrink-0" />
                </Button>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  aria-label="Delete"
                  onClick={() => remove(props.index)}
                >
                  <TrashIcon className="pointer-events-none size-4 shrink-0" />
                </Button>
              </ButtonGroup>
            </div>
            <FormControl>
              <CardContent className="space-y-6 border-t pt-6">
                {props.children}
              </CardContent>
            </FormControl>
          </Card>
        </FormItem>
      )}
    />
  )
}
