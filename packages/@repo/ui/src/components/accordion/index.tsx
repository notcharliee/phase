import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { Button } from "~/components/button"
import { LucideIcon } from "~/components/lucide-icon"

import { cn } from "~/lib/utils"

export type AccordionProps = React.ComponentPropsWithRef<
  typeof AccordionPrimitive.Root
>

export function Accordion({ className, ...props }: AccordionProps) {
  return <AccordionPrimitive.Root className={cn(className)} {...props} />
}

export interface AccordionItemProps
  extends React.ComponentPropsWithRef<typeof AccordionPrimitive.Item> {}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item className={cn("border-b", className)} {...props} />
  )
}

export interface AccordionTriggerProps
  extends React.ComponentPropsWithRef<typeof AccordionPrimitive.Trigger> {
  children: React.ReactNode
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <div
        className={cn(
          "relative flex flex-1 items-center justify-between py-1.5 text-sm font-medium underline-offset-2 transition-all hover:underline",
          className,
        )}
      >
        <AccordionPrimitive.Trigger
          className="focus-visible:ring-ring absolute left-0 top-0 h-full w-full focus-visible:outline-none focus-visible:ring-1 [&[data-state=open]~.chevron-icon>svg]:rotate-180"
          {...props}
        />
        {children}
        <AccordionPrimitive.Trigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="text-muted-foreground hover:text-foreground chevron-icon relative"
          >
            <LucideIcon
              name="chevron-down"
              className="transition-transform duration-200"
            />
          </Button>
        </AccordionPrimitive.Trigger>
      </div>
    </AccordionPrimitive.Header>
  )
}

export interface AccordionContentProps
  extends React.ComponentPropsWithRef<typeof AccordionPrimitive.Content> {
  children: React.ReactNode
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}
