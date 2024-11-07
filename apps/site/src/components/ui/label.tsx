"use client"

import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

const labelVariants = cva(
  "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
)

export interface LabelProps
  extends React.ComponentPropsWithRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
}
