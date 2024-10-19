"use client"

import * as React from "react"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import { Button } from "~/components/ui/button"

import { cn } from "~/lib/utils"

const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root ref={ref} className={cn(className)} {...props} />
))
Accordion.displayName = AccordionPrimitive.Root.displayName

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = AccordionPrimitive.Item.displayName

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <div
      className={cn(
        "relative flex flex-1 items-center justify-between py-1.5 text-sm font-medium underline-offset-2 transition-all hover:underline",
        className,
      )}
    >
      <AccordionPrimitive.Trigger
        ref={ref}
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
          <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
        </Button>
      </AccordionPrimitive.Trigger>
    </div>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
