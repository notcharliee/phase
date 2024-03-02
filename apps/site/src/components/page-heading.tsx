import Balance from "react-wrap-balancer"

import { cn } from "@/lib/utils"

export const PageHeading = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1>
      <Balance
        className={cn(
          "text-center text-4xl font-bold leading-none tracking-tighter md:text-6xl lg:leading-[1.1]",
          className,
        )}
        {...props}
      />
    </h1>
  )
}

export const PageSubheading = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={cn(
        "text-center text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]",
        className,
      )}
      {...props}
    ></h2>
  )
}

export const PageDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <Balance
      className={cn(
        "text-muted-foreground max-w-[750px] text-center text-lg sm:text-xl",
        className,
      )}
      {...props}
    />
  )
}

export const PageActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center space-x-4 py-4 md:pb-10",
        className,
      )}
      {...props}
    />
  )
}
