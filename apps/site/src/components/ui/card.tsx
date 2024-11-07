import { cn } from "~/lib/utils"

export interface CardProps extends React.ComponentPropsWithRef<"div"> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border-border bg-card text-card-foreground rounded-xl border shadow",
        className,
      )}
      {...props}
    />
  )
}

export interface CardHeaderProps extends React.ComponentPropsWithRef<"div"> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
}

export interface CardTitleProps extends React.ComponentPropsWithRef<"h3"> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

export interface CardDescriptionProps
  extends React.ComponentPropsWithRef<"p"> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
}

export interface CardContentProps extends React.ComponentPropsWithRef<"div"> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export interface CardFooterProps extends React.ComponentPropsWithRef<"div"> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
}
