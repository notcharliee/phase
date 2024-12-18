import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

const wrapperVariants = cva("", {
  variants: {
    type: {
      default: "space-y-6",
      array: "space-y-4",
    },
  },
  defaultVariants: {
    type: "default",
  },
})

export interface FormFieldWrapperProps
  extends VariantProps<typeof wrapperVariants>,
    React.ComponentPropsWithRef<"div"> {}

export function FormFieldWrapper({
  className,
  type,
  ...props
}: FormFieldWrapperProps) {
  return <div className={cn(wrapperVariants({ type }), className)} {...props} />
}
