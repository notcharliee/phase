import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground focus-visible:bg-primary/90 hover:bg-primary/90 shadow",
        destructive:
          "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground border shadow-sm",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        glow: "bg-primary border-primary text-primary-foreground !shadow-glow-sm shadow-primary/25 sm:shadow-primary/50 hover:bg-primary-foreground focus-visible:bg-primary-foreground hover:text-primary focus-visible:text-primary border",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-10 rounded-lg px-8 sm:h-11 sm:px-12",
        icon: "size-9 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ComponentPropsWithRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? (Slot as unknown as "button") : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      aria-disabled={props.disabled}
      {...props}
    />
  )
}