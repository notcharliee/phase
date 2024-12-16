import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { LucideIcon } from "~/components/lucide-icon"

import { cn } from "~/lib/utils"

export interface RadioGroupProps
  extends React.ComponentPropsWithRef<typeof RadioGroupPrimitive.Root> {}

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

export interface RadioGroupItemProps
  extends React.ComponentPropsWithRef<typeof RadioGroupPrimitive.Item> {}

export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <LucideIcon name="check" className="h-3.5 w-3.5" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
