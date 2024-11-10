"use client"

import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "~/lib/utils"

export type DrawerProps = React.ComponentPropsWithRef<
  typeof DrawerPrimitive.Root
> & {
  shouldScaleBackground?: boolean
}

export function Drawer({
  shouldScaleBackground = false,
  ...props
}: DrawerProps) {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  )
}

export const DrawerTrigger = DrawerPrimitive.Trigger
export const DrawerPortal = DrawerPrimitive.Portal
export const DrawerClose = DrawerPrimitive.Close

export interface DrawerOverlayProps
  extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Overlay> {}

export function DrawerOverlay({ className, ...props }: DrawerOverlayProps) {
  return (
    <div
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      {...props}
    />
  )
}

export interface DrawerContentProps
  extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Content> {}

export function DrawerContent({
  className,
  children,
  ...props
}: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content className="bg-background fixed inset-x-0 bottom-0 z-50 flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-t-xl border">
        <div className="from-background via-background absolute top-0 z-50 h-10 w-full bg-gradient-to-b to-transparent">
          <div className="bg-muted mx-auto mt-3 h-2 w-[100px] rounded-full" />
        </div>
        <div
          className={cn("flex flex-col overflow-auto px-8 py-10", className)}
          {...props}
        >
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

export interface DrawerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return (
    <div
      className={cn("grid gap-1.5 text-pretty pb-6 text-left", className)}
      {...props}
    />
  )
}

export interface DrawerFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

export interface DrawerTitleProps
  extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Title> {}

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <DrawerPrimitive.Title
      className={cn(
        "text-base font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  )
}

export interface DrawerDescriptionProps
  extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Description> {}

export function DrawerDescription({
  className,
  ...props
}: DrawerDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}
