"use client"

import * as React from "react"

import { LucideIcon } from "~/components/icons/lucide"
import { Badge } from "~/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { cn } from "~/lib/utils"

import type { LucideIconName } from "~/components/icons/lucide"
import type { Arrayable, Optional } from "~/types/utils"

export interface ComboboxItem {
  label: string
  value: string
  group?: string
  iconName?: LucideIconName
  colour?: `#${string}`
  disabled?: boolean
}

type ComboboxContextValue<TMultiselect extends boolean = boolean> = {
  open: boolean
  multiselect: TMultiselect
  selected: ComboboxItem[]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setMultiselect: React.Dispatch<React.SetStateAction<boolean>>
  setSelected: React.Dispatch<React.SetStateAction<ComboboxItem[]>>
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

function useComboboxContext() {
  const context = React.use(ComboboxContext)
  if (!context)
    throw new Error("useComboboxContext has to be used within <Combobox>")
  return context
}

export interface ComboboxProps
  extends React.ComponentPropsWithRef<typeof Popover> {}

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  const [multiselect, setMultiselect] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<ComboboxItem[]>([])

  return (
    <ComboboxContext
      value={{
        open,
        multiselect,
        selected,
        setOpen,
        setMultiselect,
        setSelected,
      }}
    >
      <Popover open={open} onOpenChange={setOpen} {...props} />
    </ComboboxContext>
  )
}

export interface ComboboxTriggerProps
  extends React.ComponentPropsWithRef<typeof PopoverTrigger> {}

export function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxTriggerProps) {
  return (
    <PopoverTrigger
      className={cn(
        "focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-auto min-h-9 w-full items-center justify-between whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-normal shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <LucideIcon name="chevrons-up-down" className="ml-2 opacity-50" />
    </PopoverTrigger>
  )
}

export interface ComboboxValueProps
  extends Omit<React.ComponentPropsWithRef<"div">, "children"> {
  placeholder?: string
}

export function ComboboxValue({
  className,
  placeholder = "Select an item",
  ...props
}: ComboboxValueProps) {
  const { multiselect, selected } = useComboboxContext()

  if (!selected.length) {
    return <span>{placeholder}</span>
  }

  if (multiselect) {
    return (
      <div className={cn("flex flex-wrap gap-1", className)} {...props}>
        {selected.map((item) => (
          <Badge
            key={item.value}
            variant="secondary"
            className="gap-1 bg-[--background-colour] py-px text-xs font-medium text-[--text-colour]"
            style={{
              "--text-colour": item.colour ?? `#f8f8f8`,
              "--background-colour": (item.colour ?? `#f8f8f8`) + "40",
            }}
          >
            {item.iconName && (
              <LucideIcon name={item.iconName} className="size-3" />
            )}
            {item.label}
          </Badge>
        ))}
      </div>
    )
  }

  const item = selected[0]!

  return (
    <div
      className="inline-flex items-center gap-1.5 text-[--text-colour]"
      style={{ "--text-colour": item.colour ?? `#f8f8f8` }}
    >
      {item.iconName && (
        <LucideIcon name={item.iconName} className="size-3.5" />
      )}
      <span>{item.label}</span>
    </div>
  )
}

export interface ComboboxContentProps<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
> extends React.ComponentPropsWithRef<typeof PopoverContent> {
  items: ComboboxItem[]
  multiselect?: TMultiselect
  name?: string
  value?: TValue
  onValueChange?: (value: TValue) => void
}

export function ComboboxContent<
  TMultiselect extends boolean = boolean,
  TValue extends Optional<
    Arrayable<string, TMultiselect>
  > = TMultiselect extends true ? string[] : string,
>({
  className,
  items,
  multiselect: propMultiselect,
  name,
  value: propValue,
  onValueChange,
  ...props
}: ComboboxContentProps<TMultiselect, TValue>) {
  const { open, selected, multiselect, setOpen, setSelected, setMultiselect } =
    useComboboxContext()

  const [rawValue, rawSetValue] =
    React.useState<Optional<Arrayable<string>>>(propValue)

  const setValue = React.useCallback(
    (newValueOrFn: Parameters<typeof rawSetValue>[0]) => {
      const newValue =
        typeof newValueOrFn === "function"
          ? newValueOrFn(rawValue)
          : newValueOrFn

      rawSetValue(newValue)
      onValueChange?.(newValue as TValue)
    },
    [onValueChange, rawValue],
  )

  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (propMultiselect === multiselect) return
    setMultiselect(propMultiselect ?? false)
  }, [multiselect, propMultiselect, setMultiselect])

  React.useEffect(() => {
    const oldSelected = selected
    const newSelected = items.filter((item) => rawValue?.includes(item.value))

    if (JSON.stringify(oldSelected) !== JSON.stringify(newSelected)) {
      setSelected(newSelected)
    }
  }, [items, rawValue, selected, setSelected])

  React.useEffect(() => {
    if (!open && inputValue.length) setInputValue("")
  }, [open, inputValue])

  const handleSelect = React.useCallback(
    (value: string) => {
      if (multiselect) {
        setValue((prev) => [...(prev ?? []), value])
      } else {
        setValue(value)
      }

      setOpen(false)
    },
    [multiselect, setValue, setOpen],
  )

  const handleDeselect = React.useCallback(
    (value: string) => {
      if (multiselect) {
        setValue((prev) => {
          const newValue = (prev as string[]).filter((v) => v !== value)
          return newValue.length ? newValue : undefined
        })
      } else {
        setValue(undefined)
      }

      setOpen(false)
    },
    [multiselect, setValue, setOpen],
  )

  const onCmdKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Backspace" || !selected?.length || !inputValue) {
        return
      }

      const itemToRemove = multiselect
        ? selected[selected.length - 1]!
        : selected[0]!

      handleDeselect(itemToRemove.value)
    },
    [inputValue, selected, multiselect, handleDeselect],
  )

  const onCmdSelect = React.useCallback(
    (itemValue: string) => {
      const item = items.find((i) => i.value === itemValue)
      if (!item) return

      if (selected.includes(item)) handleDeselect(item.value)
      else handleSelect(item.value)
    },
    [items, selected, handleDeselect, handleSelect],
  )

  const renderItem = React.useCallback(
    (item: ComboboxItem) => {
      const isSelected = selected.includes(item)

      return (
        <CommandItem
          key={item.value}
          value={item.value}
          keywords={[item.label]}
          disabled={item.disabled}
          onSelect={onCmdSelect}
          className="min-w-0 gap-1.5 pr-8 text-[--text-colour]"
          style={{ "--text-colour": item.colour ?? `#f8f8f8` }}
        >
          {item.iconName && (
            <LucideIcon name={item.iconName} className="size-3.5" />
          )}
          <span className="truncate">{item.label}</span>
          <span className="absolute right-2">
            {isSelected && <LucideIcon name="check" className="size-3.5" />}
          </span>
        </CommandItem>
      )
    },
    [selected, onCmdSelect],
  )

  const { miscItems, groupedItems } = React.useMemo(() => {
    const miscItems: ComboboxItem[] = []
    const groupedItems: Record<string, ComboboxItem[]> = {}

    for (const item of items) {
      if (!item.group) {
        miscItems.push(item)
      } else {
        groupedItems[item.group] = [...(groupedItems[item.group] ?? []), item]
      }
    }

    return { miscItems, groupedItems }
  }, [items])

  return (
    <PopoverContent
      className={cn(
        "max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0",
        className,
      )}
      {...props}
    >
      <Command onKeyDown={onCmdKeyDown} loop>
        <CommandInput
          placeholder={"Search..."}
          name={name}
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList>
          <CommandEmpty>{"No results found :("}</CommandEmpty>
          {!!miscItems.length && (
            <CommandGroup>{miscItems.map(renderItem)}</CommandGroup>
          )}
          {Object.entries(groupedItems).map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map(renderItem)}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </PopoverContent>
  )
}
