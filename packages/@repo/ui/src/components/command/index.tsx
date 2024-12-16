"use client"

import { Command as CommandPrimitive } from "cmdk"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/dialog"
import { LucideIcon } from "~/components/lucide-icon"

import { cn } from "~/lib/utils"

import type { DialogProps } from "@radix-ui/react-dialog"

export interface CommandProps
  extends React.ComponentPropsWithRef<typeof CommandPrimitive> {}

export function Command({ className, ...props }: CommandProps) {
  return (
    <CommandPrimitive
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className,
      )}
      {...props}
    />
  )
}

export interface CommandDialogProps extends DialogProps {
  dialogLabel: string
  dialogDescription: string
}

export function CommandDialog({
  children,
  dialogLabel,
  dialogDescription,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <div className="sr-only">
          <DialogTitle>{dialogLabel}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </div>
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export interface CommandInputProps
  extends React.ComponentPropsWithRef<typeof CommandPrimitive.Input> {}

export function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    // eslint-disable-next-line react/no-unknown-property
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <LucideIcon name="search" className="mr-2 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  )
}

export interface CommandListProps
  extends React.ComponentPropsWithRef<typeof CommandPrimitive.List> {}

export function CommandList({ className, ...props }: CommandListProps) {
  return (
    <CommandPrimitive.List
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className,
      )}
      {...props}
    />
  )
}

export interface CommandEmptyProps
  extends React.ComponentPropsWithRef<typeof CommandPrimitive.Empty> {}

export function CommandEmpty(props: CommandEmptyProps) {
  return (
    <CommandPrimitive.Empty className="py-6 text-center text-sm" {...props} />
  )
}

export interface CommandGroupProps
  extends React.ComponentPropsWithRef<typeof CommandPrimitive.Group> {}

export function CommandGroup({ className, ...props }: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...props}
    />
  )
}

export interface CommandSeparatorProps
  extends React.ComponentPropsWithRef<typeof CommandPrimitive.Separator> {}

export function CommandSeparator({
  className,
  ...props
}: CommandSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

export interface CommandItemProps
  extends React.ComponentPropsWithRef<typeof CommandPrimitive.Item> {}

export function CommandItem({ className, ...props }: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export interface CommandShortcutProps
  extends React.ComponentPropsWithRef<"span"> {}

export function CommandShortcut({ className, ...props }: CommandShortcutProps) {
  return (
    <span
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  )
}
