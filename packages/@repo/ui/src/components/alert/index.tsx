import { cn, cva } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

const alertVariants = cva(
  "[&>svg]:text-foreground relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning:
          "border-[darkorange]/50 bg-[darkorange]/5 text-[darkorange] dark:border-[darkorange] [&>svg]:text-[darkorange]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface AlertProps
  extends React.ComponentPropsWithRef<"div">,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

export interface AlertTitleProps extends React.ComponentPropsWithRef<"h5"> {}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

export interface AlertDescriptionProps
  extends React.ComponentPropsWithRef<"div"> {}

export function AlertDescription({
  className,
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}
